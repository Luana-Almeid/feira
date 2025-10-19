
'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/client';


export function LowStockProducts() {
  const { data: products, loading } = useCollection<Product>(
    query(collection(db, 'products'), where('stock', '<=', 10)) // Example threshold, adjust as needed
  );

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estoque Baixo</CardTitle>
                <CardDescription>Analisando níveis de estoque...</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center items-center h-24'>
                <Loader2 className="h-6 w-6 animate-spin text-primary"/>
            </CardContent>
        </Card>
    )
  }

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
        <div className="overflow-x-auto">
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
        </div>
      </CardContent>
    </Card>
  );
}
