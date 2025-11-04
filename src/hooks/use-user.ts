
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/client';
import { useRouter, usePathname } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // Usuário está logado
        setUser(userAuth);
        const profileRef = doc(db, 'users', userAuth.uid);
        
        const unsubProfile = onSnapshot(profileRef, async (docSnap) => {
            if (docSnap.exists()) {
                const userProfile = docSnap.data() as UserProfile;
                setProfile(userProfile);
            } else {
                // Perfil não existe, pode ser um estado intermediário ou um erro
                setProfile(null);
            }
            setLoading(false); // Carregamento concluído após buscar o perfil
        });

        return () => unsubProfile(); // Cleanup do listener do perfil

      } else {
        // Usuário não está logado
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (pathname !== '/login') {
            router.push('/login');
        }
      }
    });

    return () => unsubscribe(); // Cleanup do listener de autenticação
  }, [router, pathname]);


  return { user, profile, loading };
}
