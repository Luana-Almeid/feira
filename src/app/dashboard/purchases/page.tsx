import { PageHeader } from '@/components/page-header';
import { PurchasesHistory } from './components/purchases-history';
import { NewPurchaseDialog } from './components/new-purchase-dialog';

export default function PurchasesPage() {
  return (
    <>
      <PageHeader
        title="Compras"
        description="Registre e acompanhe as aquisições de produtos."
      >
        <NewPurchaseDialog />
      </PageHeader>
      <PurchasesHistory />
    </>
  );
}
