
import { useState, useEffect } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[]>([]);
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
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as any);
        });
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [JSON.stringify(query)]); // Simple re-fetch dependency

  return { data, loading, error };
}
