
import { PageHeader } from '@/components/page-header';
import { ReportsClient } from './components/reports-client';

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Histórico de Atividades" description="Acompanhe todas as ações realizadas no sistema." />
      <ReportsClient />
    </>
  );
}
