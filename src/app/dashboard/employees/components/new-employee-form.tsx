
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { DatePicker } from '@/components/ui/datepicker';

const employeeSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  cpf: z.string().min(14, 'O CPF deve ter 11 dígitos.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  role: z.enum(['administrador', 'funcionario'], {
    required_error: 'O perfil é obrigatório.',
  }),
  admissionDate: z.date({
    required_error: 'A data de admissão é obrigatória.',
  }),
});

export function NewEmployeeForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: '',
      role: 'funcionario',
      admissionDate: new Date(),
    },
  });

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length > 11) {
        return;
    }

    let formattedValue = rawValue;
    if (rawValue.length > 9) {
        formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3, 6)}.${rawValue.slice(6, 9)}-${rawValue.slice(9)}`;
    } else if (rawValue.length > 6) {
        formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3, 6)}.${rawValue.slice(6)}`;
    } else if (rawValue.length > 3) {
        formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3)}`;
    }
    
    field.onChange(formattedValue);
  };

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: values.name,
        cpf: values.cpf.replace(/\D/g, ''), // Store only numbers
        email: values.email,
        role: values.role,
        status: 'ativo',
        admissionDate: values.admissionDate.toISOString(),
        dismissalDate: null,
      });

      toast({
        title: 'Funcionário Cadastrado!',
        description: `${values.name} foi adicionado com sucesso.`,
      });
      router.push('/dashboard/employees');
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.message || 'Ocorreu um erro ao criar o funcionário.',
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                    <Input 
                        placeholder='000.000.000-00'
                        {...field}
                        onChange={(e) => handleCpfChange(e, field)}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="admissionDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data de Admissão</FormLabel>
                    <FormControl>
                        <DatePicker 
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione a data de admissão"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className='flex justify-between items-center'>
            <Link href="/dashboard/employees" passHref>
                <Button variant="outline" type="button">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </Link>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Funcionário
            </Button>
        </div>
      </form>
    </Form>
  );
}
