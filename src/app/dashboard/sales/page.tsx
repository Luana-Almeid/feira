
import { PageHeader } from '@/components/page-header';
import { SalesHistory } from './components/sales-history';
import { NewSaleDialog } from './components/new-sale-dialog';

export default function SalesPage() {
  return (
    <>
      <PageHeader
        title="Vendas"
        description="Registre e acompanhe suas vendas diárias."
      >
        <NewSaleDialog />
      </PageHeader>
      <SalesHistory />
    </>
  );
}
