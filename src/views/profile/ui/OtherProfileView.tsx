'use client';

import { useState, useEffect } from 'react';
import { OtherProfileHeader } from '@/widgets/profile/OtherProfileHeader';
import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { getUserProfileById } from '@/entities/user/api/getUserProfileById';
import { UserProfile } from '@/entities/user/model/types';
import { SkeletonCard } from '@/shared/ui/SkeletonCard';

interface OtherProfileViewProps {
  /** 조회할 사용자 ID */
  userId: string;
}

/**
 * 상대방 프로필 페이지 View 컴포넌트
 *
 * 기능:
 * - 해당 사용자의 프로필 정보 조회 (API)
 * - 프로필 헤더 + 프로필 카드 렌더링
 * - 좋아요/채팅 기능 제공
 *
 * 컴포넌트 구조:
 * - OtherProfileHeader: 뒤로가기 + 닉네임 + 신고 버튼
 * - OtherProfileCard: 이미지 슬라이더 + 프로필 정보 + 액션 버튼들
 *
 * 상태 관리:
 * - profileData: 상대방 프로필 데이터
 * - isLoading: 데이터 로딩 상태
 * - error: 오류 메시지
 */
export const OtherProfileView = ({ userId }: OtherProfileViewProps) => {
  // API 호출 상태 관리
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🔄 사용자 ${userId} 프로필 데이터 로드 시작...`);

        // 백엔드 API에서 해당 사용자의 프로필 데이터 조회
        const data = await getUserProfileById(userId);

        console.log(`✅ 사용자 ${userId} 프로필 데이터 로드 성공:`, data);
        setProfileData(data);
      } catch (err) {
        console.error(`❌ 사용자 ${userId} 프로필 데이터 로드 실패:`, err);

        // 에러 상세 정보 로그
        if (err instanceof Error) {
          console.error('에러 메시지:', err.message);
          setError(err.message);
        } else {
          setError('프로필 데이터를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
        console.log(`🏁 사용자 ${userId} 프로필 데이터 로드 완료`);
      }
    };

    // userId가 유효한 경우에만 데이터 로드
    if (userId) {
      loadProfileData();
    } else {
      setError('잘못된 사용자 ID입니다.');
      setIsLoading(false);
    }
  }, [userId]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-dvh pb-20">
        <OtherProfileHeader nickname={profileData?.nickname || '프로필'} />
        <div className="p-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error || !profileData) {
    return (
      <div className="min-h-dvh">
        <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-center">
            <div className="text-lg font-semibold text-gray-900">프로필 오류</div>
          </div>
        </div>
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

  // 정상 렌더링: 헤더 + 프로필 카드
  return (
    <div className="min-h-svh">
      {/* 상대방 프로필 전용 헤더 */}
      <OtherProfileHeader nickname={profileData.nickname} />

      {/* 메인 컨텐츠 영역 */}
      <div className="p-4">
        <div className="relative">
          {/* 상대방 프로필 카드 - 실제 API 데이터 사용 */}
          <OtherProfileCard profile={profileData} className="!h-[calc(100svh-100px)]" />
        </div>
      </div>
    </div>
  );
};
