import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, StepKey, AllFormData } from './types';

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

interface OnboardingState {
  step: number;
  total: number;
  data: AllFormData;
  canProceed: Partial<Record<StepKey, boolean>>;
  setCanProceed: (k: StepKey, v: boolean) => void;
  setStep: (s: number) => void;
  save: <K extends keyof AllFormData>(k: K, v: AllFormData[K]) => void;
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shallowEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a),
    kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  total: 3,
  data: {},
  canProceed: {},
  setCanProceed: (k, v) => set((s) => ({ canProceed: { ...s.canProceed, [k]: v } })),
  setStep: (step) => set({ step }),
  save: (k, v) =>
    set((s) => {
      const prev = s.data[k];
      if (shallowEqual(prev, v)) return s;
      return { data: { ...s.data, [k]: v } };
    }),
  reset: () => set({ step: 1, data: {} }),
}));
