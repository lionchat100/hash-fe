import { UserMyProfile } from './types';

// 임시 나의 프로필 데이터 (실제로는 현재 사용자 정보에서 가져올 예정)
// UserMyProfile 타입에 맞게 구조 정의
export const mockMyProfileData: UserMyProfile = {
  id: 'me',
  name: '홍길동',
  bio: '안녕하세요! 새로운 인연을 찾고 있는 대학생입니다. 함께 성장하고 좋은 추억을 만들어 나갈 분을 찾고 있어요.',
  mbti: 'ENFP',
  focusType: 'career_focused',
  position: '백엔드',
  university: {
    name: '한양대학교(ERICA)',
    logoUrl: '/university-logo.png',
    isVisible: true,
  },
  photos: ['/images/profiles/profile1.jpg', '/images/profiles/profile2.jpg', '/images/profiles/profile3.jpg'],
};
