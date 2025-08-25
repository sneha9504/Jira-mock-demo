import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  isOpen: false,
  message: '',
  type: 'info', // 'success' | 'error' | 'info'

  showNotification: (message, type = 'info') => set({
    isOpen: true,
    message,
    type,
  }),

  hideNotification: () => set({ isOpen: false, message: '', type: 'info' }),
}));

export default useNotificationStore;
