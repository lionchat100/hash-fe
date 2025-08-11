export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
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

export type EnumKey = 'genders' | 'universities' | 'positions' | 'mbtis' | 'preferenceType';

export interface DrawerConfig {
  key: EnumKey;
  label: string;
  placeholder?: string;
  contentHeader?: string;
  items: Option[];
}
