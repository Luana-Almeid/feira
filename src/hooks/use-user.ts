
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { type UserProfile } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';


// Mock user data for development
const MOCK_ADMIN_PROFILE: UserProfile = {
    uid: 'admin-user-01',
    name: 'Admin',
    email: 'admin@excelenciafrutas.com',
    cpf: '000.000.000-00',
    role: 'administrador',
    status: 'ativo',
    admissionDate: Timestamp.now(),
    dismissalDate: null
};

const MOCK_ADMIN_USER = {
    uid: 'admin-user-01',
    email: 'admin@excelenciafrutas.com',
    displayName: 'Admin',
    photoURL: `https://picsum.photos/seed/admin-user-01/40/40`,
} as User;


export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching a logged-in admin user
    setUser(MOCK_ADMIN_USER);
    setProfile(MOCK_ADMIN_PROFILE);
    setLoading(false);
  }, []);


  return { user, profile, loading };
}
