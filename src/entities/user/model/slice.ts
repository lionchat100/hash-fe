import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;

  setAuth: (auth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (currentUser: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      currentUser: null,

      setAuth: (auth: boolean) => {
        set({ isAuthenticated: auth });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setCurrentUser: (currentUser: User | null) => {
        set({ currentUser });
      },

      clearUser: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }),
    },
  ),
);
