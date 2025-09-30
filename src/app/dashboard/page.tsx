import { DollarSign, ShoppingCart, Package, BarChart } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Faturamento Total" 
          value="R$ 1.250,50" 
          icon={DollarSign} 
          description="+20.1% da última semana"
        />
        <StatCard 
          title="Vendas" 
          value="+350" 
          icon={ShoppingCart}
          description="+12.5% da última semana"
        />
        <StatCard 
          title="Produtos em Estoque" 
          value="248" 
          icon={Package}
          description="Total de itens únicos"
        />
        <StatCard 
          title="Lucro" 
          value="R$ 430,20" 
          icon={BarChart}
          description="+5.2% da última semana"
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
