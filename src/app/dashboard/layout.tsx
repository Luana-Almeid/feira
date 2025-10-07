
'use client'

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { DataProvider } from '@/contexts/data-context';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/client-provider';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FirebaseProvider>
      <DataProvider>
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
      </DataProvider>
    </FirebaseProvider>
  );
}
