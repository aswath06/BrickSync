// src/stores/useAllUsersStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAllUsersStore = create(
  persist(
    (set) => ({
      users: [],
      setUsers: (data) => set({ users: data }),
      clearUsers: () => set({ users: [] }),
    }),
    {
      name: 'all-users-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
