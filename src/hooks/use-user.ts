
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/client';
import { type UserProfile } from '@/lib/types';


export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user for development without login
    const mockUser = {
      uid: 'mock-user-id',
      email: 'admin@excelenciafrutas.com',
      displayName: 'Admin',
    } as User;

    const mockProfile: UserProfile = {
        uid: 'mock-user-id',
        name: 'Admin',
        email: 'admin@excelenciafrutas.com',
        cpf: '000.000.000-00',
        role: 'administrador',
        status: 'ativo',
        admissionDate: new Date().toISOString(),
    }
    
    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);

  }, []);

  return { user, profile, loading };
}
