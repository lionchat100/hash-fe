'use client';

import { useUserStore } from '@/entities/user/model/slice';
import { ProfileCard } from '@/widgets/profile/ProfileCard';
import { ProfileHeader } from '@/widgets/profile/ProfileHeader';
import { ProfileEditButton } from '@/widgets/profile/ProfileEditButton';
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

          {/* 수정하기 버튼 - Widgets 컴포넌트 사용 */}
          <ProfileEditButton profileId={myProfile.id} />
        </div>
      </div>
    </div>
  );
}
