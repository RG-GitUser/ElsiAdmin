
import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  loading: true, // Add loading state
  setUser: async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        set({ user: { ...user, ...userSnap.data() }, loading: false });
      } else {
        set({ user, loading: false });
      }
    } else {
      set({ user: null, loading: false });
    }
  },
  setError: (error) => set({ error }),
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useAuthStore;
