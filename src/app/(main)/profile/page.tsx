'use client';

import { useState } from 'react';
import { useUserStore } from '@/entities/user/model/slice';
import { Button } from '@/shared/ui/Button';
import { Menu, Bell, Edit } from 'lucide-react';
import { ProfileImageSlider } from '@/widgets/profile/ImageSlider';
import { ProfileInfo } from '@/widgets/profile/ProfileInfo';
import { UserMyProfile } from '@/entities/user/model/types';

// 임시 나의 프로필 데이터 (실제로는 현재 사용자 정보에서 가져올 예정)
// UserMyProfile 타입에 맞게 구조 정의
const mockMyProfileData: UserMyProfile = {
  id: 'me',
  name: '홍길동',
  bio: '안녕하세요! 새로운 인연을 찾고 있는 대학생입니다. 함께 성장하고 좋은 추억을 만들어 나갈 분을 찾고 있어요.',
  mbti: 'ENFP',
  focusType: 'career_focused',
  position: '백엔드',
  university: {
    name: '연세대학교',
    logoUrl: '/university-logo.png',
    isVisible: true,
  },
  photos: ['/images/profiles/profile1.jpg', '/images/profiles/profile2.jpg', '/images/profiles/profile3.jpg'],
};

export default function ProfilePage() {
  const { currentUser } = useUserStore();
  const myProfile = mockMyProfileData;

  // 현재 활성화된 이미지 인덱스 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 프로필 사진 데이터를 ImageSlider 컴포넌트에서 요구하는 형식으로 변환
  // string[] -> { src: string, alt: string }[] 형태로 변환
  const profileImages = myProfile.photos.map((photo, index) => ({
    src: photo,
    alt: `${myProfile.name}의 프로필 사진 ${index + 1}`,
  }));

  // ImageSlider 컴포넌트에서 이미지가 변경될 때 호출되는 콜백 핸들러
  // Swiper의 슬라이드 변경을 감지하여 현재 인덱스 상태를 업데이트
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 임시로 로그인 체크 비활성화
  // if (!currentUser) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-lg">로그인이 필요합니다.</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-dvh">
      {/* 상단 네비게이션 바 */}
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3">
          {/* 좌측 햄버거 메뉴 */}
          <Button variant="ghost" size="sm">
            <Menu className="size-6" />
          </Button>

          {/* 중앙 제목 */}
          <div className="text-lg font-semibold">프로필</div>

          {/* 우측 알림 버튼 */}
          <Button variant="ghost" size="sm">
            <Bell className="size-6" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          {/* 프로필 카드 메인 영역 - ImageSlider 컴포넌트 사용 */}
          <div
            className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
            style={{ height: 'calc(100dvh - 200px)', minHeight: '500px' }}
          >
            {/* Swiper.js 기반 ImageSlider 컴포넌트 적용 */}
            <ProfileImageSlider
              images={profileImages} // 변환된 이미지 배열 전달
              initialIndex={currentImageIndex} // 초기 슬라이드 인덱스
              onChange={handleImageChange} // 슬라이드 변경 시 콜백
              // height prop 제거 - ImageSlider가 부모 컨테이너 전체 영역을 자동으로 차지
            />

            {/* 분리된 ProfileInfo 컴포넌트 사용 - 메인 프로필 정보 표시 */}
            <ProfileInfo profile={myProfile} />
          </div>

          {/* 수정하기 버튼 - 카드 바깥쪽 아래 */}
          <div className="mt-6">
            <Button className="h-14 w-full rounded-4xl text-lg font-semibold" size="lg">
              {/* <Edit className="mr-2 h-5 w-5" /> */}
              프로필 수정하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
