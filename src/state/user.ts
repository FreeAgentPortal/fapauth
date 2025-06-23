import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import UserType from '@/types/UserType';

interface UserState {
  user: UserType | null;
  token: string | null;

  logout: () => void;
  setUser: (user: UserType) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  user: null,

  setUser: (user: UserType) => {
    console.log('Setting user:', user);
    set({ user });

    // Save user to localStorage
    localStorage.setItem('user-store', JSON.stringify(user));
  },
  logout: () => {
    console.log('Logging out');
    set({ token: undefined, user: undefined });

    localStorage.removeItem('user-store');
  },
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: null }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserStore', useUserStore);
}
