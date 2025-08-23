'use client';

import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReportButton } from '../common/ReportButton';

interface OtherProfileHeaderProps {
  nickname: string;
}
export const OtherProfileHeader = ({ nickname }: OtherProfileHeaderProps) => {
  const router = useRouter();

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리 기반 뒤로가기
  };
  return (
    <header className="safe-pt sticky top-0 z-50 h-(--space-h-header) bg-white">
      <div className="flex h-full items-center justify-between px-4">
        {/* 왼쪽: 뒤로가기 버튼 */}

        <Button variant="ghost" size="icon" onClick={handleBackClick} aria-label="뒤로가기">
          <ChevronLeft className="size-7" />
        </Button>

        {/* 가운데: 상대방 닉네임 */}
        <div className="flex-1 text-center">
          <h1 className="truncate px-4 text-lg font-semibold text-gray-900">{nickname}</h1>
        </div>

        {/* 오른쪽: 신고(더보기) 버튼 */}
        <ReportButton />
      </div>
    </header>
  );
};
