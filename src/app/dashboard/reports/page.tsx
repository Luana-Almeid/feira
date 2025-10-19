
import { PageHeader } from '@/components/page-header';
import { ReportsClient } from './components/reports-client';

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Relatórios" description="Analise o desempenho do seu negócio." />
      <ReportsClient />
    </>
  );
}
