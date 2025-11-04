
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading, don't do anything
    if (loading) return;
    
    // If not logged in and not on the login page, redirect to login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }

    // If logged in and on the login page, redirect to dashboard
    if (user && pathname === '/login') {
      router.push('/dashboard/inventory');
    }

  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in and is on the login page, just show the login page content
  if (!user && pathname === '/login') {
    return <>{children}</>;
  }
  
  // If user is logged in, show the main app layout with sidebar
  if (user) {
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

  // If none of the conditions are met (e.g., redirecting), show a loader while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
