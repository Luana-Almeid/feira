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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  purchasePrice: z.coerce.number().min(0, 'O preço de compra não pode ser negativo.'),
  sellingPrice: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  stock: z.coerce.number().int('O estoque deve ser um número inteiro.').min(0, 'O estoque não pode ser negativo.'),
  unit: z.enum(['unidade', 'kg', 'caixa'], {
    required_error: 'A unidade de medida é obrigatória.',
  }),
  category: z.enum(['Fruta', 'Produto Processado', 'Outro'], {
    required_error: 'A categoria é obrigatória.',
  }),
  lowStockThreshold: z.coerce.number().int('O limite deve ser um número inteiro.').min(0, 'O limite não pode ser negativo.'),
});

type NewProductDialogProps = {
  asTrigger?: boolean;
  buttonText?: string;
}

export function NewProductDialog({ asTrigger = true, buttonText = "Novo Produto" }: NewProductDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 0,
      unit: undefined,
      category: undefined,
      lowStockThreshold: 0,
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values);
    // Here you would typically handle the form submission, e.g., by calling an API.
    alert('Produto adicionado com sucesso (simulado)!');
    setOpen(false); // Close the dialog on successful submission
    form.reset();
  }
  
  const triggerButton = (
    <Button variant={asTrigger ? 'default': 'secondary'}>
      <PlusCircle className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );

  const buttonElement = asTrigger ? (
    <DialogTrigger asChild>{triggerButton}</DialogTrigger>
  ) : (
    <div onClick={() => setOpen(true)}>{triggerButton}</div>
  );


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {buttonElement}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo item no seu inventário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Compra (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fruta">Fruta</SelectItem>
                        <SelectItem value="Produto Processado">Produto Processado</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unidade">Unidade (un)</SelectItem>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
                        <SelectItem value="caixa">Caixa (cx)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Inicial</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alerta de Estoque Baixo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Produto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
