
import { PageHeader } from '@/components/page-header';
import { NewPurchaseDialog } from './components/new-purchase-dialog';
import { PurchasesHistory } from './components/purchases-history';

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
