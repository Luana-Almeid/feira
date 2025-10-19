
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
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Loader2 } from 'lucide-react';

const editEmployeeSchema = z.object({
  role: z.enum(['administrador', 'funcionario'], {
    required_error: 'O perfil é obrigatório.',
  }),
});

type EditEmployeeDialogProps = {
  employee: UserProfile;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function EditEmployeeDialog({ 
  employee,
  onOpenChange,
  open
}: EditEmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editEmployeeSchema>>({
    resolver: zodResolver(editEmployeeSchema),
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        role: employee.role,
      });
    }
  }, [employee, open, form]);


  async function onSubmit(values: z.infer<typeof editEmployeeSchema>) {
    setLoading(true);
    try {
      const employeeRef = doc(db, 'users', employee.uid);
      await updateDoc(employeeRef, {
        role: values.role,
      });

      toast({ title: "Perfil atualizado!", description: `O perfil de ${employee.name} foi atualizado com sucesso.`});
      onOpenChange(false);
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: "Erro ao atualizar", description: "Ocorreu um erro ao atualizar o perfil." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil do Funcionário</DialogTitle>
          <DialogDescription>
            Alterando o perfil de acesso para <strong>{employee.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Acesso</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="funcionario">Funcionário</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
