'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Bell } from 'lucide-react';

interface ExploreHeaderProps {
  /** 필터 버튼 클릭 핸들러 */
  onFilterClick: () => void;
}

/**
 * 탐색 페이지 헤더 컴포넌트
 *
 * - 좌측: 필터 버튼 (액션이므로 button 유지)
 * - 중앙: Tokit 심볼 로고 (필요 시 홈 링크로 전환 가능)
 * - 우측: 알림 아이콘 (네비게이션이므로 Link 사용)
 */
export const ExploreHeader = ({ onFilterClick }: ExploreHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* 좌측: 필터 버튼 */}
        <button
          onClick={onFilterClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          aria-label="필터 옵션 열기"
          type="button"
        >
          <SlidersHorizontal className="size-6 text-gray-700" />
        </button>

        {/* 중앙: Tokit 심볼 */}
        <div className="flex items-center">
          <Image src="/images/logo/tokit_symbol.svg" alt="Tokit" width={90} height={10} />
        </div>

        {/* 우측: 알림 링크 */}
        <Link
          href="/alarm"
          aria-label="알림 보기"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
        >
          <Bell className="size-6 text-gray-700" />
        </Link>
      </div>
    </div>
  );
};
