'use server';

import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Zod schema for validation
const JournalEntrySchema = z.object({
  mood: z.string(),
  prompt: z.string(),
  content: z.string().min(1, 'Content cannot be empty.'),
});

export type JournalEntry = {
  id: string;
  date: string; // ISO string
  mood: string;
  prompt: string;
  content: string;
};

export async function saveJournalEntry(
  entryData: Omit<JournalEntry, 'id' | 'date'>
): Promise<JournalEntry> {
  const validatedData = JournalEntrySchema.parse(entryData);

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
  try {
    const q = query(
      collection(firestore, 'journalEntries'),
      orderBy('createdAt', 'desc'),
      limit(50) // Let's limit to the 50 most recent entries for now
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: (data.createdAt as Timestamp).toDate().toISOString(),
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
