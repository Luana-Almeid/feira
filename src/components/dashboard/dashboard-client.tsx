
'use client';

import { useMemo } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, ShoppingCart, Package, AlertCircle, Loader2 } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';
import { useCollection } from '@/hooks/use-collection';
import { type Transaction, type Product } from '@/lib/types';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { startOfDay, subDays } from 'date-fns';

export function DashboardClient() {
  const sevenDaysAgo = useMemo(() => subDays(startOfDay(new Date()), 7), []);
  
  const salesQuery = useMemo(() => 
    query(
      collection(db, 'transactions'), 
      where('type', '==', 'Venda'),
      where('date', '>=', Timestamp.fromDate(sevenDaysAgo))
    )
  , [sevenDaysAgo]);
  
  const productsQuery = useMemo(() => query(collection(db, 'products')), []);

  const { data: recentSales, loading: salesLoading } = useCollection<Transaction>(salesQuery);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const loading = salesLoading || productsLoading;

  const todayStart = startOfDay(new Date());
  
  const todaySalesTotal = useMemo(() => 
    recentSales
    .filter(sale => (sale.date as Timestamp).toDate() >= todayStart)
    .reduce((sum, sale) => sum + sale.total, 0)
  , [recentSales, todayStart]);

  const todayTransactionsCount = useMemo(() => 
    recentSales.filter(sale => (sale.date as Timestamp).toDate() >= todayStart).length
  , [recentSales, todayStart]);

  const lowStockCount = useMemo(() => 
    products.filter(p => p.stock <= p.lowStockThreshold).length
  , [products]);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard
          title="Vendas Totais (Hoje)"
          value={`R$ ${todaySalesTotal.toFixed(2).replace('.', ',')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total de Transações (Hoje)"
          value={todayTransactionsCount}
          icon={ShoppingCart}
        />
        <StatCard
          title="Produtos em Estoque"
          value={products.length}
          icon={Package}
          description={`${products.reduce((acc, p) => acc + p.stock, 0)} unidades no total`}
        />
        <StatCard
          title="Alertas de Estoque"
          value={lowStockCount}
          icon={AlertCircle}
          description="Itens com estoque baixo"
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
