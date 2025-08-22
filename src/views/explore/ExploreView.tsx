'use client';

import { useState } from 'react';
import { ExploreHeader } from '@/widgets/explore/ExploreHeader';
import { FilterSlide, PositionFilter } from '@/widgets/explore/FilterSlide';
import { ExploreCardArea } from '@/features/explore-cards';
import { useExploreCards } from '@/features/explore-cards';

export const ExploreView = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ 훅은 여기서 "한 번만" 호출
  const explore = useExploreCards();
  const { selectedPosition, applyFilter } = explore;

  // 필터 관련 핸들러
  const handleFilterClick = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);

  // 필터 적용 핸들러
  const handleFilterApply = (nextPosition: PositionFilter) => {
    setIsFilterOpen(false);
    applyFilter(nextPosition); // ✅ 동일 인스턴스에 적용
  };

  return (
    <div className="min-h-svh pb-15">
      <ExploreHeader onFilterClick={handleFilterClick} />

      {/* ✅ 리스트 컴포넌트를 덤프로 만들어 모든 상태/핸들러를 내려줌 */}
      <ExploreCardArea {...explore} />

      <FilterSlide
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        selectedPosition={selectedPosition}
        onApply={handleFilterApply}
      />
    </div>
  );
};
