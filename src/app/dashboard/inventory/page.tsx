import { PageHeader } from '@/components/page-header';
import { InventoryClient } from './components/inventory-client';
import { NewProductDialog } from './components/new-product-dialog';
import { StockAdjustmentDialog } from './components/stock-adjustment-dialog';

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Controle de Estoque"
        description="Gerencie seus produtos e o inventário."
      >
        <StockAdjustmentDialog />
        <NewProductDialog />
      </PageHeader>
      <InventoryClient />
    </>
  );
}
