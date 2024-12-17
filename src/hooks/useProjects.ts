import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Project } from '../types';
import { COLLECTIONS } from '../services/collections';
import { convertFirestoreData } from '../utils/firebase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const projectsQuery = query(
      collection(db, COLLECTIONS.PROJECTS),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        try {
          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertFirestoreData(doc.data() as DocumentData)
          })) as Project[];
          
          setProjects(projectsData);
          setIsLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing projects:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error loading projects:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { projects, isLoading, error };
}