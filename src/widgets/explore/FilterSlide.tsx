'use client';

import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';

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
  /** 포지션 필터 변경 핸들러 */
  onPositionChange: (position: PositionFilter) => void;
  /** 필터 적용 핸들러 */
  onApply: () => void;
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

  // DrawerSelect의 handleConfirm과 동일한 로직
  const handleConfirm = () => {
    onPositionChange(tempPosition);
    onApply();
    onClose();
  };
  const renderPositionOptions = () => (
    <div className="flex flex-wrap items-start justify-start gap-3">
      {POSITIONS.map((position) => {
        const selected = tempPosition === position.code;
        return (
          <button
            key={position.code}
            onClick={() => setTempPosition(selected ? null : position.code)}
            // ← 1줄 3개 고정: 3등분 (calc(33.333% - gap 보정))
            className={`basis-[calc(33.333%-0.75rem)] rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              selected ? 'text-white' : 'border border-gray-300 bg-white text-gray-400 hover:border-gray-400'
            }`}
            style={selected ? { backgroundColor: 'var(--primary)' } : undefined}
          >
            {position.name}
          </button>
        );
      })}
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTitle className="hidden">직무 영역 필터</DrawerTitle>
      <DrawerContent className="fixed right-0 bottom-0 left-0 z-50 flex min-h-[400px] flex-col rounded-t-2xl bg-white shadow-lg">
        <div className="flex-1 space-y-5 overflow-y-auto px-8 pt-6">
          <div className="text-2xl font-bold text-stone-900">필터</div>
          {renderPositionOptions()}
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
