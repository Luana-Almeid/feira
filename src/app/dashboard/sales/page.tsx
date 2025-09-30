import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function SalesPage() {
  return (
    <>
      <PageHeader title="Vendas" description="Registre e acompanhe suas vendas diárias.">
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Venda
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Esta funcionalidade está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Em breve, você poderá visualizar e gerenciar todas as suas transações de venda aqui.</p>
        </CardContent>
      </Card>
    </>
  );
}
