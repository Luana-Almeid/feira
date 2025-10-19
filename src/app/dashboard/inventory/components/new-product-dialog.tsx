
'use client';

import { useEffect, useState } from 'react';
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
import { Loader2, PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';

const productSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  category: z.enum(['Fruta', 'Produto Processado', 'Bebida', 'Outro'], {
    required_error: 'A categoria é obrigatória.',
  }),
  unit: z.enum(['unidade', 'kg'], {
    required_error: 'A unidade de medida é obrigatória.',
  }),
  purchasePrice: z.coerce.number().min(0, 'O preço de compra não pode ser negativo.'),
  sellingPrice: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  lowStockThreshold: z.coerce.number().int('O limite deve ser um número inteiro.').min(0, 'O limite não pode ser negativo.'),
});

type NewProductDialogProps = {
  asTrigger?: boolean;
  buttonText?: string;
  productToEdit?: Product | null;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function NewProductDialog({ 
  asTrigger = true, 
  buttonText = "Novo Produto",
  productToEdit,
  onOpenChange,
  open: controlledOpen
}: NewProductDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        name: productToEdit.name,
        purchasePrice: productToEdit.purchasePrice,
        sellingPrice: productToEdit.sellingPrice,
        unit: productToEdit.unit,
        category: productToEdit.category,
        lowStockThreshold: productToEdit.lowStockThreshold,
      });
    } else {
      form.reset({
        name: '',
        purchasePrice: '' as any,
        sellingPrice: '' as any,
        unit: undefined,
        category: undefined,
        lowStockThreshold: 10,
      });
    }
  }, [productToEdit, open, form]);


  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);
    try {
      if (productToEdit) {
        const productRef = doc(db, 'products', productToEdit.id);
        await updateDoc(productRef, values);
        toast({ title: "Produto atualizado!", description: `${values.name} foi atualizado com sucesso.`});
      } else {
        const newProductRef = doc(collection(db, 'products'));
        const newProduct: Product = {
            ...values,
            id: newProductRef.id,
            stock: 0,
        };
        await setDoc(newProductRef, newProduct);
        toast({ title: "Produto adicionado!", description: `${values.name} foi adicionado ao seu inventário.`});
      }
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: "Erro ao salvar", description: "Ocorreu um erro ao salvar o produto." });
    } finally {
        setLoading(false);
    }
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
      {!productToEdit && buttonElement}
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
          <DialogDescription>
            {productToEdit ? 'Atualize as informações do produto.' : 'Preencha as informações abaixo para cadastrar um novo item no seu inventário.'}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fruta">Fruta</SelectItem>
                        <SelectItem value="Produto Processado">Produto Processado</SelectItem>
                        <SelectItem value="Bebida">Bebida</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unidade">Unidade (un)</SelectItem>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
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
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Compra (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="R$ 0,00" {...field} />
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
                      <Input type="number" step="0.01" placeholder="R$ 0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Estoque Baixo</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Produto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
