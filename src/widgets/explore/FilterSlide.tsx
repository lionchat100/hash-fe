'use client';

import { useState, useEffect } from 'react';

// API docs에 따른 포지션 목록
const POSITIONS = [
  { code: 'FRONTEND', name: '프론트엔드' },
  { code: 'BACKEND', name: '백엔드' },
  { code: 'FULLSTACK', name: '풀스택' },
  { code: 'AI', name: 'AI' },
  { code: 'UX_UI', name: '디자인' },
  { code: 'PM', name: 'PM' },
] as const;

export type PositionFilter = (typeof POSITIONS)[number]['code'] | 'ALL';

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
 * 하단에서 올라오는 필터 슬라이드 컴포넌트
 * 스크린샷과 동일한 디자인으로 구현
 */
export const FilterSlide = ({ isOpen, onClose, selectedPosition, onPositionChange, onApply }: FilterSlideProps) => {
  const [tempPosition, setTempPosition] = useState<PositionFilter>(selectedPosition);

  // 슬라이드가 열릴 때 현재 선택값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempPosition(selectedPosition);
    }
  }, [isOpen, selectedPosition]);

  // 적용 버튼 클릭 핸들러
  const handleApply = () => {
    onPositionChange(tempPosition);
    onApply();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* 슬라이드 컨테이너 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[70] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 루트 레이아웃 폭에 맞춤: w-full + mx-auto + max-w-screen-md + px-4 */}
        <div className="mx-auto w-full max-w-screen-md rounded-t-3xl bg-white px-4 pt-4 pb-8">
          {/* 핸들 바 */}
          <div className="mb-8 flex justify-center">
            <div className="h-1 w-12 rounded-full bg-gray-900" />
          </div>

          {/* 필터 타이틀 */}
          <h2 className="mb-8 text-2xl font-bold text-gray-900">필터</h2>

          {/* 포지션 버튼들 */}
          <div className="mb-16 space-y-4">
            {/* 첫 번째 줄: 프론트엔드, 백엔드, 풀스택 */}
            <div className="flex gap-3">
              {POSITIONS.slice(0, 3).map((position) => {
                const selected = tempPosition === position.code;
                return (
                  <button
                    key={position.code}
                    onClick={() => setTempPosition(position.code)}
                    className={`flex-1 rounded-full px-6 py-4 text-base font-medium transition-colors ${
                      selected ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    // 선택 상태일 때 --primary 적용
                    style={selected ? { backgroundColor: 'var(--primary)' } : undefined}
                  >
                    {position.name}
                  </button>
                );
              })}
            </div>

            {/* 두 번째 줄: AI, 디자인, PM */}
            <div className="flex gap-3">
              {POSITIONS.slice(3, 6).map((position) => {
                const selected = tempPosition === position.code;
                return (
                  <button
                    key={position.code}
                    onClick={() => setTempPosition(position.code)}
                    className={`flex-1 rounded-full px-6 py-4 text-base font-medium transition-colors ${
                      selected ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    // 선택 상태일 때 --primary 적용
                    style={selected ? { backgroundColor: 'var(--primary)' } : undefined}
                  >
                    {position.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 확인 버튼 */}
          <button
            onClick={handleApply}
            className="w-full rounded-full bg-gray-800 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-900"
          >
            확인
          </button>

          {/* 안전 영역 */}
          <div className="pb-safe" />
        </div>
      </div>
    </>
  );
};
