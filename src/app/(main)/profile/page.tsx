'use client';

import { useState, useEffect } from 'react';
import { ProfileCard } from '@/widgets/profile/ProfileCard';
import { ProfileHeader } from '@/widgets/profile/ProfileHeader';
import { ProfileEditButton } from '@/widgets/profile/ProfileEditButton';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserMyProfile } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export default function ProfilePage() {
  // API 호출 상태 관리
  const [profileData, setProfileData] = useState<UserMyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 백엔드 API에서 현재 사용자의 프로필 카드 데이터 조회
        const data = await getUserProfile();
        console.log(data);
        setProfileData(data);
      } catch (err) {
        console.error('❌ 프로필 데이터 로드 실패:', err);

        // 에러 상세 정보 로그
        if (err instanceof Error) {
          console.error('에러 메시지:', err.message);
          console.error('에러 스택:', err.stack);
        }

        setError('프로필 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-dvh pb-20">
        <ProfileHeader />
        <div className="p-4">
          <LoadingSpinner text="프로필을 불러오는 중이에요" size={160} className="h-96" />
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error || !profileData) {
    return (
      <div className="min-h-dvh pb-20">
        <ProfileHeader />
        <div className="p-4">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-lg text-red-600">{error || '프로필 데이터를 찾을 수 없습니다.'}</div>
              <button onClick={() => window.location.reload()} className="text-blue-600 underline">
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-15">
      {/* 헤더 */}
      <ProfileHeader />

      <div className="p-4">
        <div className="relative">
          {/* 프로필 카드 메인 영역 - 실제 API 데이터 사용 */}
          <ProfileCard profile={profileData} />

          {/* 수정하기 버튼 */}
          <ProfileEditButton />
        </div>
      </div>
    </div>
  );
}
