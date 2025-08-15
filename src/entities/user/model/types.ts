export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
  isOnboardingCompleted: boolean;
}
<<<<<<< HEAD
//유저대학 타입
export type University = {
  name: string;
  isVisible: boolean;
};

//유저프로필카드 타입
export type UserProfile = {
  id: string;
  name: string; //이름
  bio?: string; //소개글
  mbti: string;
  focusType: string; //position_focused, career_focused, preference_focused
  position: string; //기술스택
  university: University;
  photos: string[]; //최대 3장허용
  isLikedByMe?: boolean; //좋아요
};

//내 프로필카드 타입 (API 응답 구조와 일치)
export type UserMyProfile = {
  /** 사용자 ID (API에서는 userId로 제공) */
  userId: number;
  /** 사용자 이름 */
  name: string;
  /** 자기소개 */
  bio: string;
  /** 선호 매칭 타입 - "PREFERENCE_FOCUSED", "POSITION_FOCUSED", "CAREER_FOCUSED" */
  focusType: string;
  /** 직무 (한글) - "백엔드", "프론트엔드", "UX/UI 디자이너", "PM", "풀스택" */
  position: string;
  /** 대학교명 (한글) */
  university: string;
  /** 대학교 공개 여부 */
  isUniversityVisible: boolean;
  /** 프로필 이미지 URL 목록 (API에서는 imageUrls로 제공) */
  imageUrls: string[];
  /** 좋아요 상태 (본인 카드이므로 항상 false) */
  isLikedByMe: boolean;
};
=======

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
  contentHeader?: string;
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
>>>>>>> bdb6fe75124bfe8f4a88574656b806aad40ca8d7
