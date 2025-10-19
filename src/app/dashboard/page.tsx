
import { PageHeader } from '@/components/page-header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio." />
      <DashboardClient />
    </>
  );
}
