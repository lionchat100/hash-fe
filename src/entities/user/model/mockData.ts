import { UserProfile } from './types';

// 임시 나의 프로필 데이터 (실제로는 현재 사용자 정보에서 가져올 예정)
// UserMyProfile 타입에 맞게 구조 정의
export const mockMyProfileData: UserProfile = {
  userId: 1,
  nickname: '홍길동',
  bio: '안녕하세요! 새로운 인연을 찾고 있는 대학생입니다. 함께 성장하고 좋은 추억을 만들어 나갈 분을 찾고 있어요.',
  mbti: 'ENFP',
  focusType: 'career_focused',
  position: '백엔드',
  university: '연세대학교',
  isUniversityVisible: true,
  imageUrls: ['/images/profiles/profile1.jpg', '/images/profiles/profile2.jpg', '/images/profiles/white.jpg'],
  isLikedByMe: false,
};

// 임시 상대방 프로필 데이터들 (실제로는 API에서 가져올 예정)
// 다양한 케이스를 테스트하기 위한 여러 프로필 샘플
export const mockOtherProfilesData: Record<string, UserProfile> = {
  '2': {
    userId: 2,
    nickname: '김프론트',
    bio: 'React와 TypeScript를 사랑하는 프론트엔드 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많아요!',
    mbti: 'INFJ',
    focusType: 'position_focused', // 직무 관련
    position: '프론트엔드',
    university: '서울대학교',
    isUniversityVisible: true,
    imageUrls: ['/images/profiles/profile2.jpg', '/images/profiles/profile1.jpg'],
    isLikedByMe: false, // 아직 좋아요 누르지 않음
  },
  '3': {
    userId: 3,
    nickname: '박디자이너',
    bio: 'UX/UI 디자인으로 세상을 더 아름답게 만들고 싶습니다. 함께 창의적인 프로젝트를 진행해요!',
    mbti: 'ENFP',
    focusType: 'preference_focused', // 일상 이야기
    position: '디자인',
    university: '홍익대학교',
    isUniversityVisible: true,
    imageUrls: ['/images/profiles/profile5.jpg'],
    isLikedByMe: true, // 이미 좋아요 누른 상태
  },
  '4': {
    userId: 4,
    nickname: '이풀스택',
    bio: '백엔드부터 프론트엔드까지! 전체적인 개발 흐름을 이해하고 있는 개발자입니다.',
    mbti: 'INTJ',
    focusType: 'career_focused', // 취업 준비
    position: '풀스택',
    university: '카이스트',
    isUniversityVisible: false, // 대학교 정보 비공개
    imageUrls: ['/images/profiles/profile1.jpg', '/images/profiles/profile2.jpg', '/images/profiles/profile5.jpg'],
    isLikedByMe: false,
  },
};
