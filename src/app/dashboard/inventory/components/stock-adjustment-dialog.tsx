
'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, runTransaction, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { useCollection } from '@/hooks/use-collection';
import type { Product } from '@/lib/types';
import { useUser } from '@/hooks/use-user';

const adjustmentSchema = z.object({
  productId: z.string({ required_error: 'Por favor, selecione um produto.' }),
  adjustmentType: z.enum(['add', 'subtract'], { required_error: 'Selecione o tipo de ajuste.' }),
  quantity: z.coerce.number().int().positive('A quantidade deve ser um número positivo.'),
  reason: z.string().optional(),
});

export function StockAdjustmentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const productsQuery = useMemo(() => collection(db, 'products'), []);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { toast } = useToast();
  const { user, profile } = useUser();
  
  const form = useForm<z.infer<typeof adjustmentSchema>>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      adjustmentType: 'add',
      quantity: '' as any,
      reason: ''
    }
  });

  const adjustmentType = form.watch('adjustmentType');
  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof adjustmentSchema>) {
    setLoading(true);
    const productRef = doc(db, 'products', values.productId);

    if (!user || !profile) {
      toast({ variant: 'destructive', title: 'Erro de autenticação', description: 'Usuário não encontrado.' });
      setLoading(false);
      return;
    }

    try {
        await runTransaction(db, async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists()) {
                throw "Produto não encontrado!";
            }

            const productData = productDoc.data() as Product;
            const quantityToAdjust = values.adjustmentType === 'add' ? values.quantity : -values.quantity;
            const newStock = productData.stock + quantityToAdjust;

            if (newStock < 0) {
                throw `Estoque insuficiente para ${productData.name}. Apenas ${productData.stock} disponíveis.`;
            }

            transaction.update(productRef, { stock: newStock });

            // Create a transaction log for both add and subtract
            const discardTransactionRef = doc(collection(db, 'transactions'));
            transaction.set(discardTransactionRef, {
                id: discardTransactionRef.id,
                type: 'Descarte', // This type now represents both additions and subtractions (adjustments)
                date: Timestamp.now(),
                userId: user.uid,
                userName: profile.name,
                items: [{
                    productId: productData.id,
                    productName: productData.name,
                    quantity: values.quantity,
                    unitPrice: productData.purchasePrice 
                }],
                // Total is negative for subtractions, positive for additions
                total: quantityToAdjust * productData.purchasePrice,
                reason: values.reason || (values.adjustmentType === 'add' ? 'Ajuste de entrada' : 'Ajuste de saída')
            });
        });

        toast({ title: "Estoque ajustado!", description: `O estoque de ${selectedProduct?.name} foi atualizado.`});
        setOpen(false);
        form.reset({ adjustmentType: 'add', quantity: '' as any, reason: '', productId: '' });
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : String(error);
       toast({ variant: "destructive", title: "Erro ao ajustar estoque", description: errorMessage });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Ajuste de Estoque
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Estoque Manual</DialogTitle>
          <DialogDescription>
            Faça uma entrada ou saída de itens do seu inventário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={productsLoading ? "Carregando..." : "Selecione um produto para ajustar"} />
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
              name="adjustmentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Ajuste</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="add" />
                        </FormControl>
                        <FormLabel className="font-normal">Entrada (Adicionar)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="subtract" />
                        </FormControl>
                        <FormLabel className="font-normal">Saída (Remover)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantidade {selectedProduct && `(${selectedProduct.unit})`}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo do Ajuste (Obrigatório)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Perda, Doação, Contagem de estoque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Ajuste
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
