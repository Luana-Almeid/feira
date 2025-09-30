import { PlusCircle, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { InventoryClient } from './components/inventory-client';

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Controle de Estoque"
        description="Gerencie seus produtos e o inventário."
      >
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Ajuste de Estoque
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </PageHeader>
      <InventoryClient />
    </>
  );
}
