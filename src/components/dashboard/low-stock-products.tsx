
'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';

type LowStockProductsProps = {
  products: Product[];
  loading: boolean;
};

export function LowStockProducts({ products, loading }: LowStockProductsProps) {
  const lowStockProducts = useMemo(() => 
    products.filter(p => p.stock <= p.lowStockThreshold),
    [products]
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estoque Baixo</CardTitle>
          <CardDescription>Analisando níveis de estoque...</CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center items-center h-48'>
          <Loader2 className="h-6 w-6 animate-spin text-primary"/>
        </CardContent>
      </Card>
    );
  }

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estoque Baixo</CardTitle>
          <CardDescription>Nenhum produto com estoque baixo no momento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground h-48 flex items-center justify-center">Todos os produtos estão com níveis de estoque saudáveis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full'>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-center">Mínimo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-center font-bold text-destructive">{product.stock}</TableCell>
                  <TableCell className="text-center">{product.lowStockThreshold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
