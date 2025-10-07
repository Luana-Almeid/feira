
'use client';
import { PageHeader } from '@/components/page-header';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { LowStockProducts } from '@/components/dashboard/low-stock-products';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
    const { profile, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && profile && profile.role !== 'administrador') {
            router.push('/dashboard');
        }
    }, [profile, loading, router]);

    if (loading || !profile || profile.role !== 'administrador') {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Carregando ou acesso negado...</p>
            </div>
        );
    }
  return (
    <>
      <PageHeader title="Relatórios" description="Analise o desempenho do seu negócio." />
       <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
            <SalesChart />
        </div>
        <div className="lg:col-span-2">
            <LowStockProducts />
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Outros Relatórios</CardTitle>
            <CardDescription>Mais análises detalhadas.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Em breve, você terá acesso a relatórios detalhados sobre produtos mais vendidos, perdas e lucratividade.</p>
        </CardContent>
      </Card>
    </>
  );
}
