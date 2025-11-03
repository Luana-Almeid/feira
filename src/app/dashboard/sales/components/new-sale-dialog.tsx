
'use client';

import { useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/hooks/use-collection';
import { collection, doc, runTransaction, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const saleItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto."),
  quantity: z.coerce.number({invalid_type_error: "Apenas números."}).int("Apenas números inteiros.").min(1, "A quantidade mínima é 1."),
  unitPrice: z.coerce.number()
});

const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Adicione pelo menos um item à venda."),
});

export function NewSaleDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const productsQuery = useMemo(() => collection(db, 'products'), []);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);
  const watchItems = form.watch("items");


  async function onSubmit(values: z.infer<typeof saleSchema>) {
    setLoading(true);
    const total = values.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    try {
        await runTransaction(db, async (transaction) => {
            const transactionRef = doc(collection(db, 'transactions'));
            
            const itemDetails = [];
            
            for (const item of values.items) {
                const productRef = doc(db, 'products', item.productId);
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists()) {
                    throw new Error("Um dos produtos selecionados não foi encontrado.");
                }

                const productData = productDoc.data() as Product;
                if (productData.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para ${productData.name}. Apenas ${productData.stock} disponíveis.`);
                }
                
                transaction.update(productRef, { stock: increment(-item.quantity) });
                itemDetails.push({
                    productId: item.productId,
                    productName: productData.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                });
            }

            transaction.set(transactionRef, {
                id: transactionRef.id,
                type: 'Venda',
                date: Timestamp.now(),
                items: itemDetails,
                total,
            });
        });

        toast({ title: "Venda registrada!", description: `Venda de R$ ${total.toFixed(2).replace('.', ',')} foi finalizada.`});
        setOpen(false);
        form.reset({ items: [{ productId: '', quantity: 1, unitPrice: 0 }] });
    } catch(error) {
        if (error instanceof Error) {
            toast({ variant: 'destructive', title: 'Erro ao registrar venda', description: error.message });
        } else {
            toast({ variant: 'destructive', title: 'Erro ao registrar venda', description: String(error) });
        }
    } finally {
        setLoading(false);
    }
  }

  const handleProductChange = (productId: string, index: number) => {
    const product = productMap.get(productId);
    if (product) {
      form.setValue(`items.${index}.unitPrice`, product.sellingPrice, { shouldValidate: true });
    }
  }

  const total = watchItems.reduce((acc, currentItem) => {
    const itemTotal = (currentItem.quantity || 0) * (currentItem.unitPrice || 0);
    return acc + itemTotal;
  }, 0);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Venda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registrar Nova Venda</DialogTitle>
          <DialogDescription>
            Adicione os produtos e as quantidades para registrar a venda. O estoque será atualizado automaticamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-72 w-full">
              <div className="space-y-4 pr-4">
                {fields.map((field, index) => {
                  const selectedProduct = productMap.get(watchItems[index]?.productId);
                  return (
                    <div key={field.id} className="grid grid-cols-[1fr_100px_120px_auto] gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductChange(value, index);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={productsLoading ? "Carregando..." : "Selecione um produto"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                                    {product.name} {product.stock <= 0 && '(Sem estoque)'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel>Qtd. {selectedProduct && `(${selectedProduct.unit})`}</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel>Preço Unit. (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="R$ 0,00" {...field} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover item</span>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Outro Item
            </Button>
            
            <Separator />

            <div className="flex justify-end items-center">
                <span className="text-lg font-semibold">Total da Venda:</span>
                <span className="text-xl font-bold text-primary ml-4">
                    R$ {total.toFixed(2).replace('.', ',')}
                </span>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finalizar Venda
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
