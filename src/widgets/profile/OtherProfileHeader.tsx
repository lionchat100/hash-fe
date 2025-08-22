'use client';

import { Button } from '@/shared/ui/Button';
import { ChevronLeft, Siren } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OtherProfileHeaderProps {
  nickname: string;
}
export const OtherProfileHeader = ({ nickname }: OtherProfileHeaderProps) => {
  const router = useRouter();

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리 기반 뒤로가기
  };

  // 신고 버튼 클릭 핸들러
  const handleReportClick = () => {
    const confirmed = window.confirm(`${nickname}님을 신고하시겠습니까?`);
    if (confirmed) {
      // 구글 폼으로 이동
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLScwrZktsbUG3Q2AqPYNVH4cutyaJy1pO71XKLgqDbJJOVz7yg/viewform',
        '_blank',
      );
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
          <ChevronLeft className="size-6" />
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
          aria-label="신고하기"
        >
          <Siren className="size-6" />
        </Button>
      </div>
    </header>
  );
};
