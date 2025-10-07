
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/client';
import { type UserProfile } from '@/lib/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Since login is bypassed, we can simulate a logged-in user or just stop loading.
    setLoading(false);
    
    // The original logic is kept here but commented out for when you want to re-enable auth.
    /*
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
    */
  }, []);

  useEffect(() => {
    // This effect will not run if there's no user.
    if (user) {
      const profileRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(profileRef, (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
            setProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    }
  }, [user]);

  return { user, profile, loading };
}
