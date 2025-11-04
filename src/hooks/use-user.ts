
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
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Handle case where user exists in Auth but not in Firestore
            setProfile(null);
          }
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
