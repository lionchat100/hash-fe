export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
  isOnboardingCompleted: boolean;
}

type Option = {
  code: string;
  name: string;
};

export interface OnboardingData {
  genders: Option[];
  universities: Option[];
  positions: Option[];
  mbtis: Option[];
  preferenceType: Option[];
}

export type EnumKey = 'genders' | 'universities' | 'position' | 'mbti' | 'preferenceType';

export interface DrawerConfig<K extends EnumKey = EnumKey> {
  key: K;
  label: string;
  placeholder: string;
  contentHeader?: string;
  items: Option[];
}
