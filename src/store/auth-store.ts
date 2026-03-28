import { create } from "zustand";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

interface AuthStore {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  _init: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Sign-in error:", error);
      }
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  },

  _init: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, initialized: true });
    });
    return unsubscribe;
  },
}));
