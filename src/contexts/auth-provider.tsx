
'use client';

import { useUser } from '@/hooks/use-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If finished loading and there's no user, redirect to login.
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
    // If finished loading and there IS a user, and they are on the login page, redirect to home.
    if (!loading && user && pathname === '/login') {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we are on a public path or the user is authenticated, render the children
  if (pathname === '/login' || user) {
     return <>{children}</>;
  }


  // Otherwise, don't render anything as we are redirecting
  return null;
}
