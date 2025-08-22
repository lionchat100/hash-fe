'use client';

import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/tailwindMerge';

// API docs에 따른 포지션 목록
const POSITIONS = [
  { code: 'FRONTEND', name: '프론트엔드' },
  { code: 'BACKEND', name: '백엔드' },
  { code: 'FULLSTACK', name: '풀스택' },
  { code: 'AI', name: 'AI' },
  { code: 'UX_UI', name: '디자인' },
  { code: 'PM', name: 'PM' },
] as const;

export type PositionFilter = (typeof POSITIONS)[number]['code'] | null;

interface FilterSlideProps {
  /** 슬라이드 표시 여부 */
  isOpen: boolean;
  /** 슬라이드 닫기 핸들러 */
  onClose: () => void;
  /** 현재 선택된 포지션 필터 */
  selectedPosition: PositionFilter;
  /** 포지션 필터 변경 핸들러 (선택사항: 부모에서 즉시 반영하고 싶을 때만 사용) */
  onPositionChange?: (position: PositionFilter) => void; // [변경] 선택적으로
  /** 필터 적용 핸들러: 클릭 시점의 선택값을 넘김 */
  onApply: (position: PositionFilter) => void; // [변경] 시그니처 수정
}

/**
 * DrawerSelect와 동일한 구조의 필터 드로어 컴포넌트
 */
export const FilterSlide = ({ isOpen, onClose, selectedPosition, onPositionChange, onApply }: FilterSlideProps) => {
  const [tempPosition, setTempPosition] = useState<PositionFilter>(selectedPosition);

  // 드로어가 열릴 때 현재 선택값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempPosition(selectedPosition);
    }
  }, [isOpen, selectedPosition]);

  // DrawerSelect의 handleOpenChange와 동일한 로직
  const handleOpenChange = (isOpenState: boolean) => {
    if (!isOpenState) {
      setTempPosition(selectedPosition);
      onClose();
    }
  };

  // 확인 버튼: 현재 선택값을 부모로 직접 전달
  const handleConfirm = () => {
    // 선택적으로, 즉시 상단 상태를 미리 바꾸고 싶다면 아래 라인 사용
    onPositionChange?.(tempPosition); // [선택] 필요 없으면 제거 가능

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
            className={cn(
              'cursor-pointer px-6 py-2.5',
              selected ? 'bg-primary font-bold text-stone-100' : '',
            )}
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
      <DrawerContent className="fixed right-0 bottom-0 left-0 z-50 flex min-h-[400px] flex-col rounded-t-2xl bg-white shadow-lg">
        <div className="flex-1 space-y-5 overflow-y-auto px-8 pt-6">
          <div className="text-2xl font-bold text-stone-900">필터</div>
          <div className="max-h-[250px] overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
            {renderPositionOptions()}
          </div>
        </div>
        <div className="border-t p-4">
          <Button onClick={handleConfirm} className="w-full">
            확인
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
