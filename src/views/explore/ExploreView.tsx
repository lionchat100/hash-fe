'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { ExploreHeader } from '@/widgets/explore/ExploreHeader';
import { FilterSlide, PositionFilter } from '@/widgets/explore/FilterSlide';
import { getUserCards, getUserCardsByPosition } from '@/entities/user/api/getUserCards';
import { UserProfile } from '@/entities/user/model/types';
import { LoadingSpinner, InlineLoadingSpinner } from '@/shared/ui/LoadingSpinner';

const PAGE_SIZE = 10; // [추가] 요청 단위 고정

export const ExploreView = () => {
  const router = useRouter();

  const [cards, setCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionFilter>('ALL');

  const observerTarget = useRef<HTMLDivElement>(null);

  // [추가] 이미 로드한 userId 문자열 (excludeUserIds 용)
  const excludeUserIds = useMemo(() => (cards.length ? cards.map((c) => c.userId).join(',') : undefined), [cards]);

  // [변경] 최신 상태 ref에 isLoading 포함
  const currentStateRef = useRef({
    selectedPosition,
    isLoading,
    isLoadingMore,
    hasMore,
  });

  useEffect(() => {
    currentStateRef.current = { selectedPosition, isLoading, isLoadingMore, hasMore };
  }, [selectedPosition, isLoading, isLoadingMore, hasMore]);

  // [변경] 카드 로드 함수: excludeUserIds & 끝 검출 개선
  const loadCards = useCallback(
    async (isMore: boolean = false) => {
      try {
        if (isMore) setIsLoadingMore(true);
        else setIsLoading(true);

        setHasError(null);

        const { selectedPosition: currentPosition } = currentStateRef.current;

        const fetch = async () => {
          if (currentPosition === 'ALL') {
            // excludeUserIds는 더 불러올 때만 넘겨도 되고, 항상 넘겨도 무해함
            return await getUserCards({
              size: PAGE_SIZE,
              excludeUserIds,
            });
          }
          return await getUserCardsByPosition(currentPosition, PAGE_SIZE);
        };

        const newCards = await fetch();

        // [변경] 끝 검출: 요청한 크기보다 작으면 더 없음
        if (newCards.length < PAGE_SIZE) {
          setHasMore(false);
        }

        if (newCards.length === 0) {
          // 이미 hasMore는 위에서 false가 될 수 있음. 여기선 조용히 종료.
          return;
        }

        if (isMore) {
          // [보완] 혹시 서버가 exclude를 못 지켜도 프론트에서 한 번 더 중복 제거
          setCards((prev) => {
            const seen = new Set(prev.map((c) => c.userId));
            const deduped = newCards.filter((c) => !seen.has(c.userId));
            return deduped.length ? [...prev, ...deduped] : prev;
          });
        } else {
          setCards(newCards);
        }
      } catch (error) {
        console.error('카드 로드 실패:', error);
        setHasError(error instanceof Error ? error.message : '카드를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [excludeUserIds],
  );

  // [변경] 무한스크롤: isLoading도 차단 조건에 추가
  const loadMoreCards = useCallback(() => {
    const { isLoading, isLoadingMore, hasMore } = currentStateRef.current;
    if (!isLoading && !isLoadingMore && hasMore) {
      loadCards(true);
    }
  }, [loadCards]);

  // 초기 로드
  useEffect(() => {
    loadCards();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // [변경] 옵저버: rootMargin으로 프리페치, cleanup 안전화
  useEffect(() => {
    const el = observerTarget.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMoreCards();
        }
      },
      {
        root: null,
        rootMargin: '200px 0px', // 미리 당겨 로드
        threshold: 0.1,
      },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [loadMoreCards]);

  // 필터 버튼/적용 로직
  const handleFilterClick = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);
  const handlePositionChange = (position: PositionFilter) => setSelectedPosition(position);

  const handleFilterApply = () => {
    // [보완] 상태 초기화 후 새 필터로 다시 로드
    setCards([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setHasError(null);
    loadCards(false);
  };

  const handleLikeClick = async (userId: number, currentLikeState: boolean) => {
    try {
      setCards((prev) =>
        prev.map((card) => (card.userId === userId ? { ...card, isLikedByMe: !currentLikeState } : card)),
      );
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      throw error;
    }
  };

  const handleChatClick = async (_userId: number) => {
    // 구현 예정
  };

  const handleCardClick = (userId: number) => {
    // Tip: 자식 버튼 클릭 시 상세로 튀는 걸 막으려면 버튼 쪽에서 e.stopPropagation() 처리 필요
    router.push(`/profile/${userId}`);
  };

  // 로딩/에러/빈 상태 UI
  if (isLoading && cards.length === 0) {
    return (
      <div className="min-h-dvh">
        <ExploreHeader onFilterClick={handleFilterClick} />
        <div className="mx-auto max-w-screen-md p-4">
          <LoadingSpinner 
            text="새로운 프로필을 찾는 중..." 
            size={120}
            className="min-h-[60vh]"
          />
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

  return (
    <div className="min-h-dvh">
      <ExploreHeader onFilterClick={handleFilterClick} />

      <div className="mx-auto max-w-screen-md p-4">
        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card.userId} onClick={() => handleCardClick(card.userId)} className="cursor-pointer">
              <OtherProfileCard profile={card} onLikeClick={handleLikeClick} onChatClick={handleChatClick} />
            </div>
          ))}
        </div>

        {/* [변경] sentinel 크기 살짝 키움 */}
        <div ref={observerTarget} className="h-8" />

        {isLoadingMore && (
          <div className="py-8 text-center">
            <InlineLoadingSpinner text="더 많은 프로필을 불러오는 중..." />
          </div>
        )}

        {!hasMore && cards.length > 0 && (
          <div className="py-8 text-center">
            <div className="text-gray-500">모든 추천 프로필을 확인했습니다</div>
            <button
              onClick={() => {
                setCards([]);
                setHasMore(true);
                loadCards();
              }}
              className="mt-2 text-blue-600 underline"
            >
              새로운 추천 받기
            </button>
          </div>
        )}

        {cards.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="text-lg text-gray-600">추천할 프로필이 없습니다</div>
            <button onClick={() => loadCards()} className="mt-2 text-blue-600 underline">
              새로고침
            </button>
          </div>
        )}
      </div>

      <FilterSlide
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
        onApply={handleFilterApply}
      />
    </div>
  );
};
