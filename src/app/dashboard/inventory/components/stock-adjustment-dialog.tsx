'use client';

import { useState } from 'react';
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
import { SlidersHorizontal } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { useToast } from '@/hooks/use-toast';

const adjustmentSchema = z.object({
  productId: z.string({ required_error: 'Por favor, selecione um produto.' }),
  adjustmentType: z.enum(['add', 'subtract'], { required_error: 'Selecione o tipo de ajuste.' }),
  quantity: z.coerce.number().int().positive('A quantidade deve ser um número positivo.'),
  reason: z.string().optional(),
});

export function StockAdjustmentDialog() {
  const [open, setOpen] = useState(false);
  const { products, adjustStock, addTransaction } = useData();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof adjustmentSchema>>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      adjustmentType: 'add',
      quantity: undefined,
      reason: ''
    }
  });

  const adjustmentType = form.watch('adjustmentType');
  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  function onSubmit(values: z.infer<typeof adjustmentSchema>) {
    const product = products.find(p => p.id === values.productId);
    if (!product) {
      toast({ variant: "destructive", title: "Erro", description: "Produto não encontrado." });
      return;
    }

    const quantityToAdjust = values.adjustmentType === 'add' ? values.quantity : -values.quantity;
    
    try {
      adjustStock(values.productId, quantityToAdjust);

      if (values.adjustmentType === 'subtract' && values.reason) {
        addTransaction({
            id: `txn-${Date.now()}`,
            type: 'Descarte',
            date: new Date().toISOString(),
            items: [{
                product: product,
                quantity: values.quantity,
                unitPrice: product.purchasePrice
            }],
            total: values.quantity * product.purchasePrice,
            reason: values.reason
        });
      }

      toast({ title: "Estoque ajustado!", description: `O estoque de ${product.name} foi atualizado.`});
      setOpen(false);
      form.reset({ adjustmentType: 'add', quantity: undefined, reason: '', productId: '' });
    } catch (error) {
       if (error instanceof Error) {
        toast({ variant: "destructive", title: "Erro ao ajustar estoque", description: error.message });
      }
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
                        <SelectValue placeholder="Selecione um produto para ajustar" />
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
            {adjustmentType === 'subtract' && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo da Saída (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Perda, Descarte, Uso interno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit">Confirmar Ajuste</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
