
import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  loading: true,
  profilePictureUrl: null, // Add profilePictureUrl state

  setUser: async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        set({
          user: { ...user, ...userData },
          profilePictureUrl: userData.profilePictureUrl || null,
          loading: false,
        });
      } else {
        set({ user, loading: false });
      }
    } else {
      set({ user: null, profilePictureUrl: null, loading: false });
    }
  },

  setError: (error) => set({ error }),

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, profilePictureUrl: null });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useAuthStore;
