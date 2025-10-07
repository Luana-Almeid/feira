import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/client-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feira Livre Manager',
  description: 'Gerenciador de estoque para feirantes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
