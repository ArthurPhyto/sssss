import { useState, useEffect } from 'react';
import { onSnapshot, DocumentData } from 'firebase/firestore';
import { RandomURL } from '../types';
import { createProjectUrlsQuery } from '../services/queries';
import { convertFirestoreData } from '../utils/firebase';

export function useProjectUrls(projectId: string | undefined) {
  const [urls, setUrls] = useState<RandomURL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setUrls([]);
      setIsLoading(false);
      return;
    }

    const urlsQuery = createProjectUrlsQuery(projectId);

    const unsubscribe = onSnapshot(
      urlsQuery,
      (snapshot) => {
        try {
          const urlsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertFirestoreData(doc.data() as DocumentData)
          })) as RandomURL[];
          
          setUrls(urlsData);
          setIsLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing URLs:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error loading URLs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  return { urls, isLoading, error };
}