import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function LowStockProducts() {
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.lowStockThreshold
  );

  if (lowStockProducts.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estoque Baixo</CardTitle>
                <CardDescription>Nenhum produto com estoque baixo no momento.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Todos os produtos estão com níveis de estoque saudáveis.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Produtos com Estoque Baixo
        </CardTitle>
        <CardDescription>
          Os produtos a seguir precisam de reposição em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Estoque Atual</TableHead>
              <TableHead className="text-center">Mínimo</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell className="text-center">{product.lowStockThreshold}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="destructive">Baixo</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
