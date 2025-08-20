import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, StepKey, AllFormData, UserMyProfile } from './types';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (currentUser: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (currentUser: User | null) => set({ currentUser }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: 'userStorage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ currentUser: state.currentUser ? { id: state.currentUser.id } : null }),
    },
  ),
);

interface ProfileState {
  currentProfile: UserMyProfile | null;
  setCurrentProfile: (currentProfile: UserMyProfile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  currentProfile: null,
  setCurrentProfile: (currentProfile: UserMyProfile | null) => set({ currentProfile }),
  clearProfile: () => set({ currentProfile: null }),
}));

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
