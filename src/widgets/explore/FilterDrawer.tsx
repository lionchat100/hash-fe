'use client';

import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/tailwindMerge';

const POSITIONS = [
  { code: 'FRONTEND', name: '프론트엔드' },
  { code: 'BACKEND', name: '백엔드' },
  { code: 'FULLSTACK', name: '풀스택' },
  { code: 'AI', name: 'AI' },
  { code: 'UX_UI', name: '디자인' },
  { code: 'PM', name: 'PM' },
] as const;

export type PositionFilter = (typeof POSITIONS)[number]['code'] | null;

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPosition: PositionFilter;
  onApply: (position: PositionFilter) => void;
}

export const FilterDrawer = ({ isOpen, onClose, selectedPosition, onApply }: FilterDrawerProps) => {
  const [tempPosition, setTempPosition] = useState<PositionFilter>(selectedPosition);

  // 드로어가 열릴 때 현재 선택값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempPosition(selectedPosition);
    }
  }, [isOpen, selectedPosition]);

  const handleOpenChange = (isOpenState: boolean) => {
    if (!isOpenState) {
      setTempPosition(selectedPosition);
      onClose();
    }
  };

  // 확인 버튼: 현재 선택값을 부모로 직접 전달
  const handleConfirm = () => {
    // ✅ 핵심: 클릭 시점의 값 전달
    onApply(tempPosition);
    onClose();
  };

  const renderPositionOptions = () => (
    <div className="flex h-[250px] flex-wrap content-start gap-2">
      {POSITIONS.map((position) => {
        const selected = tempPosition === position.code;
        return (
          <Badge
            key={position.code}
            onClick={() => setTempPosition(selected ? null : position.code)}
            className={cn('cursor-pointer px-6 py-2.5', selected ? 'bg-primary font-bold text-stone-100' : '')}
            data-no-nav
          >
            {position.name}
          </Badge>
        );
      })}
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTitle className="sr-only">직무 영역 필터</DrawerTitle>
      <DrawerContent className="fixed right-0 bottom-0 left-0 z-50 flex min-h-[400px] flex-col rounded-t-2xl px-4 shadow-lg">
        <div className="flex-1 space-y-5 overflow-y-auto px-4">
          <div className="text-2xl font-bold text-stone-900">필터</div>
          <div className="scrollbar-hide overscroll-contain[-webkit-overflow-scrolling:touch] max-h-[250px] overflow-y-auto">
            {renderPositionOptions()}
          </div>
        </div>
        <div className="p-4">
          <Button onClick={handleConfirm} className="my-5 w-full">
            확인
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
