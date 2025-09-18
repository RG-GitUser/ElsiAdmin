
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

const useTemplatesStore = create((set) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'templates'));
      const templates = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      set({ templates, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTemplate: async (template) => {
    set({ loading: true, error: null });
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const newTemplate = { ...template, owner: user.uid, sharedWith: [], folder: template.folder || '' };
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
