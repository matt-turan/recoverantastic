'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth, getIdToken } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { app } from '@/firebase/client-config';
import { usePathname } from 'next/navigation';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setAuth(getAuth(app));
    setFirestore(getFirestore(app));
  }, []);

  // This effect will run when the auth state changes, and it will send the token to the server.
  useEffect(() => {
    const authInstance = getAuth(app);

    const unsubscribe = authInstance.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await getIdToken(user);
        // Send the token to the server via a cookie or an API call to a specific endpoint
        // Here, we'll use a fetch to an API route to set a cookie.
        await fetch('/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // User signed out, clear the cookie
        await fetch('/api/auth', {
          method: 'DELETE',
        });
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}
