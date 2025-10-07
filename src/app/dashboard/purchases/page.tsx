
import { PageHeader } from '@/components/page-header';
import { PurchasesHistory } from './components/purchases-history';
import { NewPurchaseDialog } from './components/new-purchase-dialog';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import Link from 'next/link';

export default function PurchasesPage() {
  return (
    <>
      <PageHeader
        title="Compras"
        description="Registre e acompanhe as aquisições de produtos."
      >
        <Link href="/dashboard/recommendations">
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Recomendações
            </Button>
        </Link>
        <NewPurchaseDialog />
      </PageHeader>
      <PurchasesHistory />
    </>
  );
}
