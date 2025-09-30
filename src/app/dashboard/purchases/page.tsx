import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PurchasesPage() {
  return (
    <>
      <PageHeader title="Compras" description="Registre as compras de produtos do CEASA.">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Registrar Compra
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Histórico de Compras</CardTitle>
            <CardDescription>Esta funcionalidade está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Em breve, você poderá visualizar e gerenciar todas as suas aquisições de produtos aqui.</p>
        </CardContent>
      </Card>
    </>
  );
}
