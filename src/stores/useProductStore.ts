import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
export type Product = {
  id: string;
  category: string;
  name: string;
  size?: string;
  price: string;
  imageUrl: string;
  description: string;
  availableSizes: string[];
  typeOptions?: Record<string, string[]>;
};

export type CartItem = {
  product: Product;
  selectedType?: string | null;
  selectedSize?: string | null;
  quantity: number;
  total: number;
};

type ProductStore = {
  products: Product[];
  cart: CartItem[];
  setProducts: (products: Product[]) => void;
  getProductById: (id: string) => Product | undefined;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
};

// Create store with persistence
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [], // will be filled via API or manually
      cart: [],
      setProducts: (products) => set({ products }),
      getProductById: (id) => get().products.find((p) => p.id === id),
      addToCart: (item) => {
        const currentCart = get().cart;
        const existsIndex = currentCart.findIndex(
          (cartItem) =>
            cartItem.product.id === item.product.id &&
            cartItem.selectedType === item.selectedType &&
            cartItem.selectedSize === item.selectedSize
        );

        if (existsIndex !== -1) {
          const updatedCart = [...currentCart];
          updatedCart[existsIndex] = {
            ...updatedCart[existsIndex],
            quantity: updatedCart[existsIndex].quantity + item.quantity,
            total: updatedCart[existsIndex].total + item.total,
          };
          set({ cart: updatedCart });
        } else {
          set({ cart: [...currentCart, item] });
        }
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'product-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
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
