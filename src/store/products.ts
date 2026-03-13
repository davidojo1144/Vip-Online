import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MAX_PRODUCTS = 5;

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUri?: string | null;
  createdAt: number;
};

type State = {
  products: Product[];
};

type Actions = {
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => { ok: boolean; reason?: string };
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
};

function genId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export const useProductsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (p) => {
        const list = get().products;
        if (list.length >= MAX_PRODUCTS) {
          return { ok: false, reason: 'limit' };
        }
        const next: Product = {
          id: genId(),
          name: p.name.trim(),
          price: p.price,
          imageUri: p.imageUri ?? null,
          createdAt: Date.now(),
        };
        set({ products: [next, ...list] });
        return { ok: true };
      },
      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updates, name: updates.name ? updates.name.trim() : p.name } : p
          ),
        });
      },
      removeProduct: (id) => {
        set({ products: get().products.filter((x) => x.id !== id) });
      },
      clearAll: () => set({ products: [] }),
    }),
    {
      name: 'vip-products',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (s) => ({ products: s.products }),
    }
  )
);
