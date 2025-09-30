import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Relatórios" description="Analise o desempenho do seu negócio.">
        <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Dados
        </Button>
      </PageHeader>
       <Card>
        <CardHeader>
            <CardTitle>Análise de Desempenho</CardTitle>
            <CardDescription>Esta funcionalidade está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Em breve, você terá acesso a relatórios detalhados sobre vendas, produtos mais vendidos, perdas e lucratividade.</p>
        </CardContent>
      </Card>
    </>
  );
}
