
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
    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        // Profile fetching will be handled in the next useEffect
        // Loading will be set to false there
      } else {
        // No user, so we can stop loading
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      // If there's a user, we start listening to their profile.
      // Loading remains true until the profile is fetched.
      const unsubProfile = onSnapshot(
        doc(db, 'users', user.uid),
        (docSnap) => {
          let userProfile: UserProfile | null = null;
          if (docSnap.exists()) {
            userProfile = docSnap.data() as UserProfile;
          }

          // Force admin role for specific user
          if (user.email === 'luanasoaressw@gmail.com') {
             if (userProfile) {
                userProfile.role = 'administrador';
            } else {
                // If profile doesn't exist for the owner, create a temporary one.
                userProfile = {
                    uid: user.uid,
                    name: user.displayName || 'Admin',
                    email: user.email,
                    cpf: '000.000.000-00',
                    role: 'administrador',
                    status: 'ativo',
                    admissionDate: new Date(),
                };
            }
          }

          setProfile(userProfile);
          // Now that we have the profile (or know it doesn't exist), we can stop loading.
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching user profile:", error);
          setProfile(null);
          setLoading(false); // Stop loading even if there's an error
        }
      );
      return () => unsubProfile();
    }
  }, [user]);

  return { user, profile, loading };
}
