'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductActions } from './product-actions';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const unitLabels = {
  unidade: 'unidades',
  kg: 'kg',
  caixa: 'caixas'
};

export function InventoryClient() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

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
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList>
                <TabsTrigger value="Todos">Todos</TabsTrigger>
                <TabsTrigger value="Fruta">Frutas</TabsTrigger>
                <TabsTrigger value="Produto Processado">Processados</TabsTrigger>
                <TabsTrigger value="Outro">Outros</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="relative p-0">
              <Image
                src={product.image.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className="rounded-t-lg object-cover aspect-[4/3]"
                data-ai-hint={product.image.imageHint}
              />
              <div className="absolute top-2 right-2">
                <ProductActions product={product} />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
              <CardDescription className="text-primary font-semibold">
                R$ {product.sellingPrice.toFixed(2).replace('.', ',')} / {product.unit}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="w-full text-sm text-muted-foreground flex justify-between items-center">
                    <span>Estoque:</span>
                    <span className={`font-bold ${product.stock <= product.lowStockThreshold ? 'text-destructive' : 'text-foreground'}`}>
                        {product.stock} {unitLabels[product.unit]}
                    </span>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
