import { create } from 'zustand';
import { getFunctions, httpsCallable } from 'firebase/functions';

const useUsersStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const functions = getFunctions();
      const listUsers = httpsCallable(functions, 'listUsers');
      const result = await listUsers();
      set({ users: result.data.users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUsersStore;
