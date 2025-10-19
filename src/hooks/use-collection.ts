
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
    
    // The onSnapshot listener will handle live updates.
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

    // Unsubscribe when the component unmounts or the query changes.
    return () => unsubscribe();
  // We remove the dependency array to avoid re-running on every render due to query object re-creation.
  // The query object itself is not stable. We'll rely on onSnapshot to get updates.
  // A more advanced implementation might use useMemo to memoize the query, but for now this is safer.
  }, [query]); 

  return { data, loading, error };
}
