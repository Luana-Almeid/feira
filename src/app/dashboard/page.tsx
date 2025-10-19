
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio." />
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
          title="Vendas Totais (Hoje)"
          value="R$ 1.250,00"
          icon={DollarSign}
          description="+15% vs. ontem"
        />
        <StatCard 
          title="Total de Transações"
          value={42}
          icon={ShoppingCart}
          description="+5% vs. ontem"
        />
        <StatCard 
          title="Produtos em Estoque"
          value={234}
          icon={Package}
        />
         <StatCard 
          title="Alertas de Estoque"
          value={3}
          icon={AlertCircle}
          description="Itens com estoque baixo"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <SalesChart />
        <LowStockProducts />
      </div>
    </>
  );
}

