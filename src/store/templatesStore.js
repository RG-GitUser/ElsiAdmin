
import { create } from 'zustand';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
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
        const templatesCollectionRef = collection(db, 'templates');
        const querySnapshot = await getDocs(templatesCollectionRef);
        const allTemplates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), folder: doc.data().folder || '' }));
        set({ templates: allTemplates, loading: false });
      } else {
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
        const newTemplate = { 
          ...template, 
          owner: user.uid, 
          createdBy: user.uid,
          createdAt: serverTimestamp(),
          folder: template.folder || '' 
        };
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
      const auth = getAuth();
      const user = auth.currentUser;
      const templateRef = doc(db, 'templates', id);
      const updateData = {
        ...updatedTemplate,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };
      await updateDoc(templateRef, updateData);
      set((state) => ({
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, ...updateData } : template
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
