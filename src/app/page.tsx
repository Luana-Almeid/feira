
import { PageHeader } from '@/components/page-header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio." />
      <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <DashboardClient />
      </Suspense>
    </>
  );
}
