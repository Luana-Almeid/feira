
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Loader2, Leaf } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/client';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // Check user status in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userProfile = userDoc.data() as UserProfile;
        if (userProfile.status === 'inativo') {
          await signOut(auth);
          toast({
            variant: 'destructive',
            title: 'Acesso Negado',
            description: 'Este usuário está inativo e não pode acessar o sistema.',
          });
          return;
        }
      } else {
        // If profile doesn't exist for some reason, deny access
        await signOut(auth);
        toast({
          variant: 'destructive',
          title: 'Acesso Negado',
          description: 'Perfil de usuário não encontrado.',
        });
        return;
      }
      
      toast({
        title: 'Bem-vindo(a) de volta!',
      });
      // O redirecionamento será tratado pelo AuthProvider
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha inválidos.';
      }
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  // Se o usuário já estiver logado ou carregando, não exibe o formulário
  // para evitar piscar a tela enquanto o AuthProvider redireciona.
  if (userLoading || user) {
     return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Leaf className="h-7 w-7 text-primary-foreground" />
                </div>
            </div>
          <CardTitle className="text-2xl font-headline">Bem-vindo(a)!</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs">
            <p className='text-muted-foreground'>Excelência Frutas © {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
