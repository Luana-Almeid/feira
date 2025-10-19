
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { type UserProfile } from '@/lib/types';

// Mocked user data
const mockedUser: User = {
  uid: 'mock-admin-uid',
  email: 'admin@excelenciafrutas.com',
  displayName: 'Admin',
  photoURL: `https://picsum.photos/seed/mock-admin-uid/40/40`,
  // Add other necessary User properties with mock values
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
};

const mockedProfile: UserProfile = {
    uid: 'mock-admin-uid',
    name: 'Administrador',
    email: 'admin@excelenciafrutas.com',
    cpf: '00000000000',
    role: 'administrador',
    status: 'ativo',
    dismissalDate: null
};


export function useUser() {
  const [user, setUser] = useState<User | null>(mockedUser);
  const [profile, setProfile] = useState<UserProfile | null>(mockedProfile);
  const [loading, setLoading] = useState(false); // Start with loading as false

  // The hook now simply returns the mocked data.
  // All Firebase Auth and Firestore snapshot logic is removed for now.

  return { user, profile, loading };
}
