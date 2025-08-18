'use client';

import { Button } from '@/shared/ui/Button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OtherProfileHeaderProps {
  /** 상대방의 닉네임 */
  nickname: string;
  /** 신고 버튼 클릭 핸들러 */
  onReportClick?: () => void;
}

/**
 * 상대방 프로필 페이지 전용 헤더 컴포넌트
 *
 * 기능:
 * - 뒤로가기 버튼 (이전 페이지로 이동)
 * - 상대방 닉네임 표시
 * - 신고 버튼 (더보기 아이콘으로 표현)
 *
 * @param nickname - 상대방의 닉네임
 * @param onReportClick - 신고 버튼 클릭 시 호출되는 함수
 */
export const OtherProfileHeader = ({ nickname, onReportClick }: OtherProfileHeaderProps) => {
  const router = useRouter();

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리 기반 뒤로가기
  };

  // 신고 버튼 클릭 핸들러
  const handleReportClick = () => {
    if (onReportClick) {
      onReportClick();
    } else {
      // 기본 동작: 신고 기능 준비 중 알림
      alert('신고 기능은 준비 중입니다.');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="flex h-10 w-10 items-center justify-center p-0"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* 가운데: 상대방 닉네임 */}
        <div className="flex-1 text-center">
          <h1 className="truncate px-4 text-lg font-semibold text-gray-900">{nickname}</h1>
        </div>

        {/* 오른쪽: 신고(더보기) 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReportClick}
          className="flex h-10 w-10 items-center justify-center p-0"
          aria-label="더보기 옵션"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
