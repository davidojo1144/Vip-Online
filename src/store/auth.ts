import { create } from 'zustand';
import { setAuthToken } from '@/lib/api';

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthState = {
  user: User;
  token: string | null;
  setSession: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setSession: async (user, token) => {
    await setAuthToken(token);
    set({ user, token });
  },
  logout: async () => {
    await setAuthToken(null);
    set({ user: null, token: null });
  },
}));
