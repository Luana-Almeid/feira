import { PageHeader } from '@/components/page-header';
import { SalesHistory } from './components/sales-history';
import { NewSaleDialog } from './components/new-sale-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function SalesPage() {
  return (
    <>
      <PageHeader
        title="Vendas"
        description="Registre e acompanhe suas vendas diárias."
      >
        {/* <NewSaleDialog /> */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Venda
        </Button>
      </PageHeader>
      <SalesHistory />
    </>
  );
}
