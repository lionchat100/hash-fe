export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
  isOnboardingCompleted: boolean;
}
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
