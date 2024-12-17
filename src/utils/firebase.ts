import { Timestamp, DocumentData } from 'firebase/firestore';

export const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date();
};

export const convertFirestoreData = (data: DocumentData) => ({
  ...data,
  createdAt: convertTimestamp(data.createdAt),
  updatedAt: convertTimestamp(data.updatedAt)
});