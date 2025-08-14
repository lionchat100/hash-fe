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

//내 프로필카드 타입
export type UserMyProfile = {
  id: string;
  name: string; //이름
  bio?: string; //소개글
  mbti: string;
  focusType: string; //position_focused, career_focused, preference_focused
  position: string; //기술스택
  university: University;
  photos: string[]; //최대 3장허용
};
