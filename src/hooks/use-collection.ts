
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData } from 'firebase/firestore';

interface WithId {
    id: string;
}

export function useCollection<T extends DocumentData>(query: Query | null) {
  const [data, setData] = useState<(T & WithId)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data: (T & WithId)[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as T & WithId);
        });
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firebase Snapshot Error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query ? JSON.stringify(query.toJSON()) : null]); 

  return { data, loading, error };
}
