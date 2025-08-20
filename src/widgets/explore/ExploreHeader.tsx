'use client';

import Image from 'next/image';
import { SlidersHorizontal, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExploreHeaderProps {
  /** 필터 버튼 클릭 핸들러 */
  onFilterClick: () => void;
}

/**
 * 탐색 페이지 헤더 컴포넌트
 *
 * 기능:
 * - 좌측: 필터 아이콘 (슬라이더)
 * - 중앙: Tokit 심볼 로고
 * - 우측: 알림 아이콘 (벨)
 * - 고정 헤더로 스크롤 시에도 상단에 고정
 */
export const ExploreHeader = ({ onFilterClick }: ExploreHeaderProps) => {
  const router = useRouter();

  // 알림 페이지로 이동
  const handleNotificationClick = () => {
    router.push('/alarm');
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* 좌측: 필터 버튼 */}
        <button
          onClick={onFilterClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          aria-label="필터 옵션 열기"
        >
          <SlidersHorizontal className="size-6 text-gray-700" />
        </button>

        {/* 중앙: Tokit 심볼 */}
        <div className="flex items-center">
          <Image src="/images/logo/tokit_symbol.svg" alt="Tokit" width={90} height={10} />
        </div>

        {/* 우측: 알림 버튼 */}
        <button
          onClick={handleNotificationClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          aria-label="알림 보기"
        >
          <Bell className="size-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
