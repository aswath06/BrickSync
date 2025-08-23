import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useToggleStore = create((set) => ({
  isEnglish: true, // default language English
  setLanguage: async (value) => {
    set({ isEnglish: value });
    await AsyncStorage.setItem('appLanguage', JSON.stringify(value));
  },
  loadLanguage: async () => {
    const stored = await AsyncStorage.getItem('appLanguage');
    if (stored !== null) {
      set({ isEnglish: JSON.parse(stored) });
    }
  },
}));
