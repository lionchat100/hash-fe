'use client';

import { useUserStore } from '@/entities/user/model/slice';
import { Button } from '@/shared/ui/Button';
import { ProfileCard } from '@/widgets/profile/ProfileCard';
import { ProfileHeader } from '@/widgets/profile/ProfileHeader';
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
      {/* 헤더 */}
      <ProfileHeader />

      <div className="p-4">
        <div className="relative">
          {/* 프로필 카드 메인 영역 - ProfileCard 컴포넌트 사용 */}
          <ProfileCard profile={myProfile} />

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
