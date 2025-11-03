'use client';

import { useMemo } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, ShoppingCart, Package, AlertCircle, Users, Trophy, Sparkles, Calendar, TrendingDown, Wrench, UserX } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';
import { useCollection } from '@/hooks/use-collection';
import { type Transaction, type Product, type UserProfile } from '@/lib/types';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { HighlightCard } from './highlight-card';

// Helper function to find the most sold product
const getMostSoldProduct = (sales: Transaction[], period: 'day' | 'week' | 'month') => {
  const periodStartDate = {
    day: startOfDay(new Date()),
    week: startOfWeek(new Date()),
    month: startOfMonth(new Date()),
  }[period];

  const productCounts = sales
    .filter(sale => (sale.date as Timestamp).toDate() >= periodStartDate)
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      acc[item.productName] = (acc[item.productName] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  if (Object.keys(productCounts).length === 0) {
    return { name: 'N/A', quantity: 0 };
  }

  return Object.entries(productCounts).reduce((mostSold, [name, quantity]) => {
    return quantity > mostSold.quantity ? { name, quantity } : mostSold;
  }, { name: '', quantity: 0 });
};

const getLeastSoldProduct = (sales: Transaction[], allProducts: Product[], period: 'month') => {
  const periodStartDate = startOfMonth(new Date());

  const soldProductQuantities = sales
    .filter(sale => (sale.date as Timestamp).toDate() >= periodStartDate)
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      acc[item.productName] = (acc[item.productName] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  let leastSold = { name: 'N/A', quantity: Infinity };

  // Check for products that were not sold at all
  const soldProductNames = new Set(Object.keys(soldProductQuantities));
  const unsoldProducts = allProducts.filter(p => !soldProductNames.has(p.name));

  if (unsoldProducts.length > 0) {
    return { name: unsoldProducts[0].name, quantity: 0 };
  }

  if (Object.keys(soldProductQuantities).length === 0) {
    return { name: 'N/A', quantity: 0 };
  }

  // If all products were sold, find the one with the minimum quantity
  for (const [name, quantity] of Object.entries(soldProductQuantities)) {
    if (quantity < leastSold.quantity) {
      leastSold = { name, quantity };
    }
  }
  
  return leastSold.quantity === Infinity ? { name: 'N/A', quantity: 0 } : leastSold;
};

const getMostAdjustedProduct = (adjustments: Transaction[]) => {
    if (adjustments.length === 0) {
        return { name: 'N/A', quantity: 0 };
    }

    const productCounts = adjustments
        .flatMap(adj => adj.items)
        .reduce((acc, item) => {
            acc[item.productName] = (acc[item.productName] || 0) + 1; // count adjustment occurrences
            return acc;
        }, {} as Record<string, number>);

    if (Object.keys(productCounts).length === 0) {
        return { name: 'N/A', quantity: 0 };
    }

    return Object.entries(productCounts).reduce((mostAdjusted, [name, quantity]) => {
        return quantity > mostAdjusted.quantity ? { name, quantity } : mostAdjusted;
    }, { name: '', quantity: 0 });
};


export function DashboardClient() {
  const monthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);
  
  const transactionsQuery = useMemo(() => 
    query(
      collection(db, 'transactions'), 
      where('date', '>=', Timestamp.fromDate(monthAgo))
    )
  , [monthAgo]);
  
  const productsQuery = useMemo(() => query(collection(db, 'products')), []);
  const usersQuery = useMemo(() => query(collection(db, 'users')), []);

  const { data: recentTransactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);


  const loading = transactionsLoading || productsLoading || usersLoading;

  const recentSales = useMemo(() => recentTransactions.filter(t => t.type === 'Venda'), [recentTransactions]);
  const recentAdjustments = useMemo(() => recentTransactions.filter(t => t.type === 'Descarte'), [recentTransactions]);

  const todayStart = startOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  
  const { todaySales, weekSales, monthSales, todayTransactionsCount } = useMemo(() => {
    const salesData = {
      todaySales: 0,
      weekSales: 0,
      monthSales: 0,
      todayTransactionsCount: 0,
    };
    recentSales.forEach(sale => {
      const saleDate = (sale.date as Timestamp).toDate();
      if (saleDate >= monthStart) salesData.monthSales += sale.total;
      if (saleDate >= weekStart) salesData.weekSales += sale.total;
      if (saleDate >= todayStart) {
        salesData.todaySales += sale.total;
        salesData.todayTransactionsCount++;
      }
    });
    return salesData;
  }, [recentSales, todayStart, weekStart, monthStart]);


  const { activeEmployees, inactiveEmployees } = useMemo(() => ({
    activeEmployees: users.filter(u => u.status === 'ativo').length,
    inactiveEmployees: users.filter(u => u.status === 'inativo').length,
  }), [users]);

  const lowStockCount = useMemo(() => products.filter(p => p.stock <= p.lowStockThreshold).length, [products]);

  const mostSoldToday = useMemo(() => getMostSoldProduct(recentSales, 'day'), [recentSales]);
  const mostSoldThisWeek = useMemo(() => getMostSoldProduct(recentSales, 'week'), [recentSales]);
  const mostSoldThisMonth = useMemo(() => getMostSoldProduct(recentSales, 'month'), [recentSales]);
  const leastSoldThisMonth = useMemo(() => getLeastSoldProduct(recentSales, products, 'month'), [recentSales, products]);
  const mostAdjustedProduct = useMemo(() => getMostAdjustedProduct(recentAdjustments), [recentAdjustments]);


  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        <StatCard
          title="Vendas (Hoje)"
          value={`R$ ${todaySales.toFixed(2).replace('.', ',')}`}
          icon={DollarSign}
          description={`${todayTransactionsCount} transações hoje`}
        />
        <StatCard
          title="Vendas (Mês)"
          value={`R$ ${monthSales.toFixed(2).replace('.', ',')}`}
          icon={ShoppingCart}
          description={`Total de R$ ${weekSales.toFixed(2).replace('.', ',')} na semana`}
        />
        <StatCard
          title="Funcionários Ativos"
          value={activeEmployees}
          icon={Users}
          description={`${inactiveEmployees} inativo(s)`}
        />
        <StatCard
          title="Produtos em Estoque"
          value={products.length}
          icon={Package}
          description={`${lowStockCount} item(ns) com estoque baixo`}
        />
         <StatCard
          title="Funcionários Inativos"
          value={inactiveEmployees}
          icon={UserX}
          description={`Do total de ${users.length} funcionários`}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        <HighlightCard 
          title="Produto do Dia"
          icon={Sparkles}
          productName={mostSoldToday.name}
          quantity={mostSoldToday.quantity}
          unit='unidades vendidas'
        />
        <HighlightCard 
          title="Produto da Semana"
          icon={Trophy}
          productName={mostSoldThisWeek.name}
          quantity={mostSoldThisWeek.quantity}
          unit='unidades vendidas'
        />
        <HighlightCard 
          title="Produto do Mês"
          icon={Calendar}
          productName={mostSoldThisMonth.name}
          quantity={mostSoldThisMonth.quantity}
          unit='unidades vendidas'
        />
        <HighlightCard 
          title="Produto Menos Vendido (Mês)"
          icon={TrendingDown}
          productName={leastSoldThisMonth.name}
          quantity={leastSoldThisMonth.quantity}
          unit='unidades vendidas'
        />
        <HighlightCard 
          title="Produto com Mais Ajustes"
          icon={Wrench}
          productName={mostAdjustedProduct.name}
          quantity={mostAdjustedProduct.quantity}
          unit='ajustes manuais'
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 md:gap-8">
        <div className="lg:col-span-4">
          <SalesChart sales={recentSales} />
        </div>
        <div className="lg:col-span-3">
          <LowStockProducts products={products} loading={productsLoading} />
        </div>
      </div>
    </>
  );
}
