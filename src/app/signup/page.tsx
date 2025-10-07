
'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.').optional().or(z.literal('')),
  cpf: z.string().length(11, 'O CPF deve ter 11 dígitos.').optional().or(z.literal('')),
  email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional().or(z.literal('')),
});

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    // TEMPORARY: Bypass signup for testing
    toast({
        title: 'Redirecionando...',
        description: 'Cadastro temporariamente desabilitado para teste.',
    });
    router.push('/dashboard');
    setLoading(false);
    
    // Original signup logic commented out
    /*
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Create user profile in Firestore (as administrator by default on self-signup)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: values.name,
        cpf: values.cpf,
        email: values.email,
        role: 'administrador',
        status: 'ativo',
        dismissalDate: null,
      });

      toast({
        title: 'Cadastro Realizado!',
        description: 'Sua conta foi criada com sucesso. Você será redirecionado.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no Cadastro',
        description: error.message.includes('email-already-in-use') ? 'Este e-mail já está em uso.' : 'Ocorreu um erro ao criar sua conta.',
      });
    } finally {
        setLoading(false);
    }
    */
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-headline text-2xl font-bold">Feira Livre</span>
            </div>
          <CardTitle>Crie sua Conta de Administrador</CardTitle>
          <CardDescription>
            Preencha seus dados para começar a gerenciar seu negócio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
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
                        <Input placeholder='Somente números' {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cadastrar
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
