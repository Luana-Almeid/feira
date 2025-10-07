'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { ProductActions } from './product-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/data-context';
import { cn } from '@/lib/utils';

const unitLabels: Record<Product['unit'], string> = {
  unidade: 'unidades',
  kg: 'kg',
};

export function InventoryClient() {
  const { products, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (categoryFilter === 'Todos') return true;
      return product.category === categoryFilter;
    });

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar produtos..." 
            className="pl-10 w-full sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                <TabsList className="grid w-full grid-cols-4 sm:inline-flex">
                    <TabsTrigger value="Todos">Todos</TabsTrigger>
                    <TabsTrigger value="Fruta">Frutas</TabsTrigger>
                    <TabsTrigger value="Produto Processado">Processados</TabsTrigger>
                    <TabsTrigger value="Outro">Outros</TabsTrigger>
                </TabsList>
            </Tabs>
             <div className="hidden sm:flex items-center gap-1 rounded-lg bg-muted p-1">
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                 <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
            {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
                <CardHeader className="relative p-6">
                <div className="absolute top-2 right-2">
                    <ProductActions product={product} onDelete={() => deleteProduct(product.id)} />
                </div>
                <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-1">
                <CardDescription className="text-primary font-semibold">
                    R$ {product.sellingPrice.toFixed(2).replace('.', ',')} / {product.unit}
                </CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <div className="w-full text-sm text-muted-foreground flex justify-between items-center">
                        <span>Estoque:</span>
                        <span className={cn('font-bold', product.stock <= product.lowStockThreshold ? 'text-destructive' : 'text-foreground')}>
                            {product.stock} {unitLabels[product.unit]}
                        </span>
                    </div>
                </CardFooter>
            </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Preço de Venda</TableHead>
                    <TableHead className="w-[60px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                         <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(product.stock <= product.lowStockThreshold ? 'text-destructive font-bold' : '')}>
                           {product.stock} {unitLabels[product.unit]}
                        </span>
                      </TableCell>
                      <TableCell>R$ {product.sellingPrice.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell className="text-right">
                        <ProductActions product={product} onDelete={() => deleteProduct(product.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
