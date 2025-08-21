'use client';

import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';
import { NotificationButton } from '@/widgets/common/NotificationButton';
import { Button } from '@/shared/ui/Button';

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
    <header className="safe-pt sticky top-0 z-50 flex h-(--space-h-header) w-full items-center justify-between bg-white px-4">
      <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onFilterClick}>
        <SlidersHorizontal className="size-6 text-gray-900" />
      </Button>

      {/* 중앙: Tokit 심볼 */}
      <div className="flex items-center">
        <Image src="/images/logo/tokit_symbol.svg" alt="Tokit" width={90} height={10} />
      </div>

      {/* 우측: 알림 아이콘 */}
      <NotificationButton />
    </header>
  );
};
