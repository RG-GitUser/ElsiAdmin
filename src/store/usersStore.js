
import { create } from 'zustand';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const useUsersStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = await addDoc(collection(db, 'users'), user);
        set((state) => ({
          users: [...state.users, { id: docRef.id, ...user }],
          loading: false,
        }));
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateUser: async (id, updatedUser) => {
    set({ loading: true, error: null });
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, updatedUser);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'users', id));
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUsersStore;
