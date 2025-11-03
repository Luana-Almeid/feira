
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/client-provider';
import './globals.css';
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/auth-provider';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Excelência Frutas',
  description: 'Gerenciador de estoque para feirantes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <FirebaseProvider>
          <AuthProvider>
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                {children}
            </Suspense>
          </AuthProvider>
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
