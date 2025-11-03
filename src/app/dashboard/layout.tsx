
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/contexts/auth-provider';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
