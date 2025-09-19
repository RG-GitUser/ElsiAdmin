import { create } from 'zustand';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const useUsersStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const db = getFirestore();
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ users: usersList, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUsersStore;
