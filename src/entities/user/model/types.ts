export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
  isOnboardingCompleted: boolean;
}

// onboarding enums 타입 정의
type Option = {
  code: string;
  name: string;
};

export interface OnboardingData {
  genders: Option[];
  universities: Option[];
  positions: Option[];
  mbti: Option[];
  preferenceType: Option[];
}

export type EnumKey = 'genders' | 'universities' | 'position' | 'mbti' | 'preferenceType';

export interface DrawerConfig<K extends EnumKey = EnumKey> {
  key: K;
  label: string;
  placeholder: string;
  items: Option[];
}

// onboarding Step 1, 2, 3 데이터 타입 정의
export type StepKey = 'step1' | 'step2' | 'step3';
export type StepFormHandle = { submit: () => void };

export interface Step1Data {
  nickname: string;
  university: string;
  isUniversityView: boolean;
  gender: string;
}
export interface Step2Data {
  mbti: string;
  position: string;
  preferenceType: string;
}
export interface Step3Data {
  bio: string;
  images: File[];
}

export interface AllFormData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
}

export type Step2FormKey = keyof Step2Data;

export interface OnboardingFormData {
  nickname: Step1Data['nickname'];
  university: Step1Data['university'];
  gender: Step1Data['gender'];
  position: Step2Data['position'];
  mbti: Step2Data['mbti'];
  preferenceType: Step2Data['preferenceType'];
  bio: Step3Data['bio'];
  requiredAgreements: boolean;
  isUniversityView: boolean;
  marketingAgreements: boolean;
  imageIds: number[];
}

export interface UploadImage {
  imageId: number;
  imageUrl: string;
}

export interface onboardingConfirm {
  userId: number;
  message: string;
  isOnboardingCompleted: boolean;
}
