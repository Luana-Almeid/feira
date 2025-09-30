'use client';

import { useState } from 'react';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { products } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { NewProductDialog } from '@/app/dashboard/inventory/components/new-product-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
    console.log(values);
    // Here you would typically handle the form submission, e.g., by calling an API.
    // This would then update the stock levels.
    alert('Compra registrada com sucesso (simulado)!');
    setOpen(false);
    form.reset();
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
                            <FormLabel>Produto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductChange(value, index);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um produto" />
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
                            <FormLabel>Qtd. {selectedProduct && `(${selectedProduct.unit})`}</FormLabel>
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
                            <FormLabel>Custo Unit. (R$)</FormLabel>
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
              <Button type="submit">Salvar Compra</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
