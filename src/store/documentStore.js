import { create } from 'zustand';

const initialFileSystem = {
  root: {
    type: 'folder',
    children: {
      Personal: { type: 'folder', children: {} },
      Work: { type: 'folder', children: {} },
      'performance-review.pdf': { type: 'file' },
    },
  },
};

const useDocumentStore = create((set) => ({
  fileSystem: initialFileSystem,
  setFileSystem: (newFileSystem) => set({ fileSystem: newFileSystem }),
}));

export default useDocumentStore;