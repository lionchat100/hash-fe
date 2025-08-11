export type StepKey = 'step1' | 'step2' | 'step3';

export type Step1Data = { nickname: string; university: string; isUniversityView: boolean; gender: string };
export type Step2Data = { mbti: string; position: string; preferenceType: string };
export type Step3Data = { intro: string };

export type DataByStep = {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
};

export type Step2FormKey = keyof Step2Data;
