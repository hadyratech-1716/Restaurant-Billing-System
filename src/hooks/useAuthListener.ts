import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuthStore, type AppUser } from '../store/useAuthStore';

export function useAuthListener() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let appUser: AppUser;

          if (userDocSnap.exists()) {
            appUser = userDocSnap.data() as AppUser;
          } else {
            // If user exists in Auth but not Firestore, create basic profile
            appUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'cashier', // Default role
            };
            await setDoc(userDocRef, appUser);
          }
          
          setUser(appUser, firebaseUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null, null);
        }
      } else {
        setUser(null, null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
}
