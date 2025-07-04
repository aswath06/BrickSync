import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAccountStore = create(
  persist(
    (set) => ({
      account: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        verifiedPhone: false,
      },
      setAccount: (data) =>
        set((state) => ({
          account: {
            ...state.account,
            ...data,
          },
        })),
    }),
    {
      name: 'account-storage',
      storage: {
        getItem: async (name) => {
          const item = await AsyncStorage.getItem(name);
          return item != null ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
