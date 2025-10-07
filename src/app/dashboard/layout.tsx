
'use client'

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { DataProvider } from '@/contexts/data-context';
import { FirebaseProvider } from '@/firebase/client-provider';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
