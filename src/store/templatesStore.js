
import { create } from 'zustand';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const useTemplatesStore = create((set) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // Simplified query: ONLY fetch templates owned by the current user.
        const templatesCollectionRef = collection(db, 'templates');
        const q = query(templatesCollectionRef, where('owner', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userTemplates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), folder: doc.data().folder || '' }));
        set({ templates: userTemplates, loading: false });
      } else {
        // If no user is logged in, no templates will be fetched.
        set({ templates: [], loading: false });
      }
    } catch (error) {
      console.error("FATAL: Error fetching templates:", error);
      set({ error: `FATAL: Failed to fetch templates. Details: ${error.message}`, loading: false });
    }
  },

  addTemplate: async (template) => {
    set({ loading: true, error: null });
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // Templates are private by default, removing all public/sharing logic.
        const newTemplate = { ...template, owner: user.uid, folder: template.folder || '' };
        const docRef = await addDoc(collection(db, 'templates'), newTemplate);
        set((state) => ({
          templates: [...state.templates, { id: docRef.id, ...newTemplate }],
          loading: false,
        }));
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTemplate: async (id, updatedTemplate) => {
    set({ loading: true, error: null });
    try {
      const templateRef = doc(db, 'templates', id);
      await updateDoc(templateRef, updatedTemplate);
      set((state) => ({
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, ...updatedTemplate } : template
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteTemplate: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'templates', id));
      set((state) => ({
        templates: state.templates.filter((template) => template.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useTemplatesStore;
