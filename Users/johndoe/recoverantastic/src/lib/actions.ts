'use server';

import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase-admin';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Zod schema for validation
const JournalEntrySchema = z.object({
  userId: z.string(),
  mood: z.string(),
  prompt: z.string(),
  content: z.string().min(1, 'Content cannot be empty.'),
});

export type JournalEntry = {
  id: string;
  date: string; // ISO string
  userId: string;
  mood: string;
  prompt: string;
  content: string;
};

async function getUserId(): Promise<string | null> {
  const sessionCookie = cookies().get('fb-session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

export async function saveJournalEntry(
  entryData: Omit<JournalEntry, 'id' | 'date'>
): Promise<JournalEntry> {
  const validatedData = JournalEntrySchema.parse(entryData);
  const uid = await getUserId();
  
  if (!uid || uid !== validatedData.userId) {
     throw new Error('User is not authorized to perform this action.');
  }

  try {
    const docRef = await addDoc(collection(firestore, 'journalEntries'), {
      ...validatedData,
      createdAt: Timestamp.now(),
    });

    const newEntry: JournalEntry = {
      id: docRef.id,
      date: new Date().toISOString(),
      ...validatedData,
    };

    revalidatePath('/journal');

    return newEntry;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Could not save journal entry.');
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const uid = await getUserId();

  if (!uid) {
    return [];
  }

  try {
    const q = query(
      collection(firestore, 'journalEntries'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: (data.createdAt as Timestamp).toDate().toISOString(),
        userId: data.userId,
        mood: data.mood,
        prompt: data.prompt,
        content: data.content,
      } as JournalEntry;
    });
    return entries;
  } catch (error) {
    console.error('Error fetching documents: ', error);
    throw new Error('Could not retrieve journal entries.');
  }
}
