'use client';

import { useState } from 'react';
import { useUserStore } from '@/entities/user/model/slice';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Menu, Bell, Edit } from 'lucide-react';

// 임시 나의 프로필 데이터 (실제로는 현재 사용자 정보에서 가져올 예정)
const mockMyProfileData = {
  id: 'me',
  name: '홍길동',
  bio: '안녕하세요! 새로운 인연을 찾고 있는 대학생입니다. 함께 성장하고 좋은 추억을 만들어 나갈 분을 찾고 있어요.',
  mbti: 'ENFP',
  focusType: 'career_focused',
  position: '백엔드',
  university: {
    name: '서울대학교',
    logoUrl: '/university-logo.png',
    isVisible: true,
  },
  photos: ['/my-profile1.jpg', '/my-profile2.jpg', '/my-profile3.jpg'],
};

export default function ProfilePage() {
  const { currentUser } = useUserStore();
  const myProfile = mockMyProfileData;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSlideNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % myProfile.photos.length);
  };

  const handleSlidePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + myProfile.photos.length) % myProfile.photos.length);
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
          <div className="text-lg font-semibold">마이페이지</div>

          {/* 우측 알림 버튼 */}
          <Button variant="ghost" size="sm">
            <Bell className="size-6" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          {/* 프로필 카드 메인 영역 */}
          <div
            className="relative w-full overflow-hidden rounded-3xl bg-cover bg-center shadow-2xl"
            style={{
              height: 'calc(100dvh - 200px)', // 네비바(약 72px) + 패딩 + 수정하기 버튼(약 128px) 고려
              minHeight: '500px', // 최소 높이 보장
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url('${myProfile.photos[currentImageIndex]}')`,
            }}
            onClick={handleSlideNext}
          >
            {/* 사진 슬라이드 동그라미 - 상단 중앙 */}
            <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
              <div className="flex gap-2">
                {myProfile.photos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full bg-white transition-opacity ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-60'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 메인 프로필 정보 */}
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
              {/* 이름과 대학교 */}
              <div className="mb-3 md:mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{myProfile.name}</h1>
                  <div className="flex items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                      <span className="text-xs font-bold text-white">서</span>
                    </div>
                    <span className="text-sm font-medium">{myProfile.university.name}</span>
                  </div>
                </div>
                <p className="sleading-relaxed mb-3 text-sm opacity-90 md:mb-4 md:text-base">{myProfile.bio}</p>
              </div>

              {/* 태그들 */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {myProfile.mbti}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {myProfile.position}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {myProfile.focusType === 'career_focused'
                    ? '커리어 중심'
                    : myProfile.focusType === 'position_focused'
                      ? '포지션 중심'
                      : '취향 중심'}
                </Badge>
              </div>
            </div>
          </div>

          {/* 수정하기 버튼 - 카드 바깥쪽 아래 */}
          <div className="mt-6">
            <Button className="h-14 w-full rounded-4xl text-lg font-semibold" size="lg">
              <Edit className="mr-2 h-5 w-5" />
              프로필 수정하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
