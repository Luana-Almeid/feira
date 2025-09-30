'use client';

import { DollarSign, ShoppingCart, Package, BarChart } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';
import { useData } from '@/contexts/data-context';

export default function DashboardPage() {
  const { products, transactions } = useData();

  const totalRevenue = transactions
    .filter(t => t.type === 'Venda')
    .reduce((sum, t) => sum + t.total, 0);

  const totalSales = transactions.filter(t => t.type === 'Venda').length;
  
  const totalProductsInStock = products.reduce((sum, p) => sum + p.stock, 0);

  const totalCost = transactions
    .filter(t => t.type === 'Compra')
    .reduce((sum, t) => sum + t.total, 0);
  
  const profit = totalRevenue - totalCost;

  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Vendas" 
          value={totalSales}
          icon={ShoppingCart}
        />
        <StatCard 
          title="Produtos em Estoque" 
          value={totalProductsInStock}
          icon={Package}
          description={`${products.length} produtos únicos`}
        />
        <StatCard 
          title="Lucro" 
          value={`R$ ${profit.toFixed(2).replace('.', ',')}`}
          icon={BarChart}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
            <SalesChart />
        </div>
        <div className="lg:col-span-2">
            <LowStockProducts />
        </div>
      </div>
    </>
  );
}
