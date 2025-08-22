'use client';

import { useState } from 'react';
import { ExploreHeader } from '@/widgets/explore/ExploreHeader';
<<<<<<< HEAD
import { FilterDrawer, PositionFilter } from '@/widgets/explore/FilterDrawer';
import { ExploreCardArea } from '@/features/explore-cards';
import { useExploreCards } from '@/features/explore-cards';
=======
import { FilterSlide, PositionFilter } from '@/widgets/explore/FilterSlide';
import { getUserCards } from '@/entities/user/api/getUserCards';
import { UserProfile } from '@/entities/user/model/types';
import { FallbackScreen, InlineLoadingSpinner } from '@/widgets/common/FallbackScreen';
import Image from 'next/image';

const PAGE_SIZE = 10;
>>>>>>> d89de2fa36a2d647e0405e7b458674ddc9e818be

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

<<<<<<< HEAD
=======
  const handleCardClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  // 로딩/에러/빈 상태 UI
  if (isLoading && cards.length === 0) {
    return (
      <div className="min-h-dvh">
        <ExploreHeader onFilterClick={handleFilterClick} />
        <div className="mx-auto max-w-screen-md p-4">
          <FallbackScreen text="새로운 프로필을 찾는 중..." size={120} className="min-h-[60vh]" />
        </div>
      </div>
    );
  }

  if (hasError && cards.length === 0) {
    return (
      <div className="mx-auto max-w-screen-md p-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-lg text-red-600">{hasError}</div>
            <button onClick={() => loadCards()} className="text-blue-600 underline">
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

>>>>>>> d89de2fa36a2d647e0405e7b458674ddc9e818be
  return (
    <div className="min-h-svh pb-15">
      <ExploreHeader onFilterClick={handleFilterClick} />

      {/* ✅ 리스트 컴포넌트를 덤프로 만들어 모든 상태/핸들러를 내려줌 */}
      <ExploreCardArea {...explore} />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        selectedPosition={selectedPosition}
        onApply={handleFilterApply}
      />
    </div>
  );
};
