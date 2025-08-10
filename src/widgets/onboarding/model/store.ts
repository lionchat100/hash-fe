import { create } from 'zustand';
import type { Step1Data, Step2Data, Step3Data } from './types';

type OnboardingData = { step1?: Step1Data; step2?: Step2Data; step3?: Step3Data };

type State = {
  step: number;
  total: number;
  data: OnboardingData;
  setStep: (s: number) => void;
  save: <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => void;
  reset: () => void;
};

const shallowEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a),
    kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
};

export const useOnboardingStore = create<State>((set) => ({
  step: 1,
  total: 3,
  data: {},
  setStep: (step) => set({ step }),
  save: (k, v) =>
    set((s) => {
      const prev = s.data[k];
      if (shallowEqual(prev, v)) return s;
      return { data: { ...s.data, [k]: v } };
    }),
  reset: () => set({ step: 1, data: {} }),
}));
