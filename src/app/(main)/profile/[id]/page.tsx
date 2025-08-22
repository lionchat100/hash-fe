'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OtherProfileHeader } from '@/widgets/profile/OtherProfileHeader';
import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { getUserProfileById } from '@/entities/user/api/getUserProfileById';
import { UserProfile } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

/**
 * 상대방 프로필 페이지 컴포넌트
 *
 * URL: /profile/[id]
 *
 * 기능:
 * - URL 파라미터에서 사용자 ID 추출
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
export default function OtherProfilePage() {
  const params = useParams();
  const userId = params.id as string;

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

  // 신고 버튼 클릭 핸들러
  const handleReportClick = () => {
    console.log(`신고 요청: 사용자 ${userId}`);
    // TODO: 신고 모달 또는 페이지 구현
    alert(`사용자 ${profileData?.nickname}을 신고하시겠습니까? 신고 기능은 곧 추가될 예정입니다.`);
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-dvh">
        <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-center">
            <div className="text-lg font-semibold text-gray-900">프로필</div>
          </div>
        </div>
        <div className="p-4">
          <LoadingSpinner text="프로필을 불러오는 중..." size={120} className="h-96" />
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
    <div className="min-h-dvh">
      {/* 상대방 프로필 전용 헤더 */}
      <OtherProfileHeader nickname={profileData.nickname} onReportClick={handleReportClick} />

      {/* 메인 컨텐츠 영역 */}
      <div className="p-4">
        <div className="relative">
          {/* 상대방 프로필 카드 - 실제 API 데이터 사용 */}
          <OtherProfileCard profile={profileData} />
        </div>
      </div>
    </div>
  );
}
