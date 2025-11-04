
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction, type Product, type UserProfile } from '@/lib/types';
import { Loader2, DollarSign, Users, Package, TrendingUp, TrendingDown, Wrench, Ban, AlertTriangle, BarChart, ArrowUp, ArrowDown, PackageCheck } from 'lucide-react';
import { startOfMonth, startOfDay, subDays } from 'date-fns';
import { StatCard } from './stat-card';
import { SalesChart } from './sales-chart';
import { LowStockProducts } from './low-stock-products';
import { HighlightCard } from './highlight-card';

export function DashboardClient() {
  const lastMonth = useMemo(() => startOfMonth(new Date()), []);
  const todayStart = useMemo(() => startOfDay(new Date()), []);
  const yesterdayStart = useMemo(() => startOfDay(subDays(new Date(), 1)), []);
  
  const transactionsQuery = useMemo(() => 
    query(collection(db, 'transactions'), where('date', '>=', lastMonth), orderBy('date', 'desc'))
  , [lastMonth]);
  
  const productsQuery = useMemo(() => query(collection(db, 'products')), []);
  const usersQuery = useMemo(() => query(collection(db, 'users')), []);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const loading = transactionsLoading || productsLoading || usersLoading;

  const {
    salesToday,
    salesYesterday,
    activeEmployees,
    inactiveEmployees,
    totalProducts,
    totalItemsInStock,
    lowStockCount,
    productOfTheDay,
    productOfTheMonth,
    leastSoldProductMonth,
    mostAdjustedProduct,
  } = useMemo(() => {
    // Filter transactions for different periods
    const todaySalesTx = transactions.filter(t => t.type === 'Venda' && (t.date as Timestamp).toDate() >= todayStart);
    const yesterdaySalesTx = transactions.filter(t => {
      const date = (t.date as Timestamp).toDate();
      return t.type === 'Venda' && date >= yesterdayStart && date < todayStart;
    });
    const monthSales = transactions.filter(t => t.type === 'Venda');
    const monthAdjustments = transactions.filter(t => t.type === 'Descarte');

    // Sales stats
    const salesToday = todaySalesTx.reduce((acc, sale) => acc + sale.total, 0);
    const salesYesterday = yesterdaySalesTx.reduce((acc, sale) => acc + sale.total, 0);

    // Employee stats
    const activeEmployees = users.filter(u => u.status === 'ativo').length;
    const inactiveEmployees = users.filter(u => u.status === 'inativo').length;

    // Product stats
    const totalProducts = products.length;
    const totalItemsInStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

    // Most sold product logic
    const getMostSold = (sales: Transaction[]) => {
      if (sales.length === 0) return { name: 'N/A', quantity: 0, unit: 'vendas' };
      const productCount: Record<string, { name: string; quantity: number, unit: string }> = {};
      
      sales.forEach(sale => {
        sale.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
              if (!productCount[item.productId]) {
                productCount[item.productId] = { name: item.productName, quantity: 0, unit: product.unit };
              }
              productCount[item.productId].quantity += item.quantity;
          }
        });
      });
      
      return Object.values(productCount).reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current, { name: 'N/A', quantity: 0, unit: 'vendas' });
    };

    // Least sold product logic
    const getLeastSoldMonth = (sales: Transaction[], allProducts: Product[]) => {
        if (allProducts.length === 0) return { name: 'N/A', quantity: 0, unit: 'vendas' };
        const productCount: Record<string, number> = {};

        allProducts.forEach(p => productCount[p.id] = 0);

        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (productCount.hasOwnProperty(item.productId)) {
                    productCount[item.productId] += item.quantity;
                }
            });
        });

        let leastSoldId = allProducts[0].id;
        for (const productId in productCount) {
            if (productCount[productId] < productCount[leastSoldId]) {
                leastSoldId = productId;
            }
        }
        
        const product = allProducts.find(p => p.id === leastSoldId);
        return {
            name: product?.name || 'N/A',
            quantity: productCount[leastSoldId],
            unit: product?.unit || 'vendas'
        };
    };

    const getMostAdjusted = (adjustments: Transaction[], allProducts: Product[]) => {
        if (adjustments.length === 0) return { name: 'N/A', quantity: 0, unit: 'ajustes' };
        const adjustmentCount: Record<string, number> = {};

        adjustments.forEach(adj => {
            adj.items.forEach(item => {
                if (!adjustmentCount[item.productId]) {
                    adjustmentCount[item.productId] = 0;
                }
                adjustmentCount[item.productId]++;
            });
        });

        if (Object.keys(adjustmentCount).length === 0) return { name: 'N/A', quantity: 0, unit: 'ajustes' };

        const mostAdjustedId = Object.keys(adjustmentCount).reduce((a, b) => adjustmentCount[a] > adjustmentCount[b] ? a : b);
        const product = allProducts.find(p => p.id === mostAdjustedId);

        return {
            name: product?.name || 'N/A',
            quantity: adjustmentCount[mostAdjustedId],
            unit: 'ajustes'
        };
    };

    return {
      salesToday,
      salesYesterday,
      activeEmployees,
      inactiveEmployees,
      totalProducts,
      totalItemsInStock,
      lowStockCount,
      productOfTheDay: getMostSold(todaySalesTx),
      productOfTheMonth: getMostSold(monthSales),
      leastSoldProductMonth: getLeastSoldMonth(monthSales, products),
      mostAdjustedProduct: getMostAdjusted(monthAdjustments, products),
    };
  }, [transactions, products, users, todayStart, yesterdayStart]);

  const salesPercentageChange = useMemo(() => {
    if (salesYesterday === 0) {
      return salesToday > 0 ? 100 : 0;
    }
    return ((salesToday - salesYesterday) / salesYesterday) * 100;
  }, [salesToday, salesYesterday]);


  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Vendas (hoje)"
          value={`R$ ${salesToday.toFixed(2).replace('.', ',')}`}
          icon={DollarSign}
          description={
            salesYesterday > 0 ? (
              <>
                <span className={salesPercentageChange >= 0 ? "text-primary" : "text-destructive"}>
                  {salesPercentageChange >= 0 ? `+${salesPercentageChange.toFixed(1)}%` : `${salesPercentageChange.toFixed(1)}%`}
                </span>
                <span className='ml-1'>em relação a ontem</span>
              </>
            ) : "Nenhuma venda ontem"
          }
        />
        <StatCard
          title="Itens em Estoque"
          value={totalItemsInStock}
          icon={PackageCheck}
          description={`${totalProducts} produtos diferentes`}
        />
         <StatCard
          title="Estoque Baixo"
          value={lowStockCount}
          icon={AlertTriangle}
          description="Itens precisando de atenção"
        />
        <StatCard
          title="Funcionários Ativos"
          value={activeEmployees}
          icon={Users}
          description={`${inactiveEmployees} funcionários inativos`}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
         <HighlightCard
            title="Produto do Dia"
            icon={TrendingUp}
            productName={productOfTheDay.name}
            quantity={productOfTheDay.quantity}
            unit={productOfTheDay.unit}
        />
        <HighlightCard
            title="Produto do Mês"
            icon={BarChart}
            productName={productOfTheMonth.name}
            quantity={productOfTheMonth.quantity}
            unit={productOfTheMonth.unit}
        />
        <HighlightCard
            title="Menos Vendido (Mês)"
            icon={TrendingDown}
            productName={leastSoldProductMonth.name}
            quantity={leastSoldProductMonth.quantity}
            unit={leastSoldProductMonth.unit}
        />
         <HighlightCard
            title="Mais Ajustes Manuais"
            icon={Wrench}
            productName={mostAdjustedProduct.name}
            quantity={mostAdjustedProduct.quantity}
            unit={mostAdjustedProduct.unit}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <SalesChart sales={transactions.filter(t => t.type === 'Venda')} />
        </div>
        <div className="lg:col-span-3">
            <LowStockProducts products={products} loading={productsLoading}/>
        </div>
      </div>
    </div>
  );
}
