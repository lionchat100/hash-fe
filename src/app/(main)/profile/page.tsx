'use client';

import { useUserStore } from '@/entities/user/model/slice';
import { Button } from '@/shared/ui/Button';
import { Menu, Bell } from 'lucide-react';
import { ProfileCard } from '@/widgets/profile/ProfileCard';
import { mockMyProfileData } from '@/entities/user/model/mockData';

export default function ProfilePage() {
  const { currentUser } = useUserStore();
  const myProfile = mockMyProfileData;

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
          {/* 프로필 카드 메인 영역 - ProfileCard 컴포넌트 사용 */}
          <ProfileCard profile={mockMyProfileData} />

          {/* 수정하기 버튼 - 카드 바깥쪽 아래 */}
          <div className="mt-6">
            <Button className="h-14 w-full rounded-4xl text-lg font-semibold" size="lg">
              프로필 수정하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
