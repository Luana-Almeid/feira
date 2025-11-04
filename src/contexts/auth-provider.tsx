
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && pathname === '/login') {
      // Se o usuário está logado e na página de login, redireciona
      if (profile?.role === 'administrador') {
        router.replace('/dashboard');
      } else {
        router.replace('/dashboard/inventory');
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Se não estiver logado e não estiver na página de login, não renderiza nada (o hook useUser já redireciona)
  if (!user && pathname !== '/login') {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se estiver na página de login, renderiza apenas o children (a própria página de login)
  if (pathname === '/login') {
    return <>{children}</>;
  }


  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                  {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}
