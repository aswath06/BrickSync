import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,

  // Set user data globally
  setUser: (userData) => set({ user: userData }),

  // Clear user data (e.g., on logout)
  clearUser: () => set({ user: null }),
}));
