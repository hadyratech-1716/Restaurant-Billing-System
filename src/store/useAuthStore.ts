import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  branchId?: string;
}

interface AuthState {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  setUser: (user: AppUser | null, firebaseUser: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  setUser: (user, firebaseUser) => set({ user, firebaseUser, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
