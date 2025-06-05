import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: null }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserStore', useUserStore);
}
