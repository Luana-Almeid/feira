
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
import { NewProductDialog } from '@/app/dashboard/inventory/components/new-product-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/hooks/use-collection';
import { collection, doc, writeBatch, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Product } from '@/lib/types';
import { useUser } from '@/hooks/use-user';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto.'),
  quantity: z.coerce.number().min(1, 'A quantidade mínima é 1.'),
  unitPrice: z.coerce.number().min(0, 'O preço de compra não pode ser negativo.'),
});

const purchaseSchema = z.object({
  items: z.array(purchaseItemSchema).min(1, 'Adicione pelo menos um item à compra.'),
});

export function NewPurchaseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const productsQuery = useMemo(() => collection(db, 'products'), []);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { toast } = useToast();
  const { user, profile } = useUser();

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const watchItems = form.watch('items');

  async function onSubmit(values: z.infer<typeof purchaseSchema>) {
    setLoading(true);
    const total = values.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    if (!user || !profile) {
      toast({ variant: 'destructive', title: 'Erro de autenticação', description: 'Usuário não encontrado.' });
      setLoading(false);
      return;
    }

    try {
        const batch = writeBatch(db);

        // 1. Create transaction doc
        const transactionRef = doc(collection(db, 'transactions'));
        batch.set(transactionRef, {
            id: transactionRef.id,
            type: 'Compra',
            date: Timestamp.now(),
            userId: user.uid,
            userName: profile.name,
            items: values.items.map(item => ({
                productId: item.productId,
                productName: productMap.get(item.productId)?.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
            total,
        });

        // 2. Update stock for each product
        values.items.forEach(item => {
            const productRef = doc(db, 'products', item.productId);
            batch.update(productRef, { stock: increment(item.quantity) });
        });

        await batch.commit();

        toast({ title: "Compra registrada!", description: `Sua compra de R$ ${total.toFixed(2).replace('.', ',')} foi adicionada.`});
        setOpen(false);
        form.reset({ items: [{ productId: '', quantity: 1, unitPrice: 0 }] });
    } catch(error) {
        console.error(error);
        if (error instanceof Error) {
            toast({ variant: 'destructive', title: 'Erro ao registrar compra', description: error.message });
        }
    } finally {
        setLoading(false);
    }
  }

  const handleProductChange = (productId: string, index: number) => {
    const product = productMap.get(productId);
    if (product) {
      form.setValue(`items.${index}.unitPrice`, product.purchasePrice, { shouldValidate: true });
    }
  };

  const total = watchItems.reduce((acc, currentItem) => {
    const itemTotal = (currentItem.quantity || 0) * (currentItem.unitPrice || 0);
    return acc + itemTotal;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registrar Nova Compra</DialogTitle>
          <DialogDescription>
            Adicione os produtos e os valores para registrar a entrada de mercadorias no estoque.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-72 w-full">
              <div className="space-y-4 pr-4">
                {fields.map((field, index) => {
                  const selectedProduct = productMap.get(watchItems[index]?.productId);
                  return (
                    <div key={field.id} className="grid grid-cols-12 gap-2 sm:gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="col-span-12 sm:col-span-6">
                            <FormLabel className={index > 0 ? 'sr-only' : ''}>Produto</FormLabel>
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
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
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
                          <FormItem className="col-span-4 sm:col-span-2">
                             <FormLabel className={index > 0 ? 'sr-only' : ''}>Qtd. {selectedProduct && `(${selectedProduct.unit})`}</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="col-span-6 sm:col-span-3">
                             <FormLabel className={index > 0 ? 'sr-only' : ''}>Custo Unit. (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-2 sm:col-span-1">
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
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Item
                </Button>
                <NewProductDialog asTrigger={false} buttonText='Cadastrar Novo Produto'/>
            </div>

            <Separator />

            <div className="flex justify-end items-center">
              <span className="text-lg font-semibold">Custo Total da Compra:</span>
              <span className="text-xl font-bold text-primary ml-4">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Compra
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
