'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { ExploreHeader } from '@/widgets/explore/ExploreHeader';
import { FilterSlide, PositionFilter } from '@/widgets/explore/FilterSlide';
import { getUserCards } from '@/entities/user/api/getUserCards';
import { UserProfile } from '@/entities/user/model/types';
import { LoadingSpinner, InlineLoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useChatStartOnExplore } from '@/features/update-chat';
import { toast } from 'sonner';
import Image from 'next/image';

const PAGE_SIZE = 10;

export const ExploreView = () => {
  const router = useRouter();

  const [cards, setCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionFilter>(null);
  const { startChat } = useChatStartOnExplore();

  const observerTarget = useRef<HTMLDivElement>(null);

  // 버튼/링크 클릭 시 카드 내비게이션 방지
  const isInActionElement = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement | null;
    return !!el?.closest('button, a, [role="button"], [data-no-nav]');
  };

  // 로드한 userId 문자열 (excludeUserIds 용)
  const excludeUserIds = useMemo(() => (cards.length ? cards.map((c) => c.userId).join(',') : undefined), [cards]);

  // 최신 상태를 즉시 참조하기 위한 ref
  const currentStateRef = useRef({
    selectedPosition,
    isLoading,
    isLoadingMore,
    hasMore,
  });

  useEffect(() => {
    currentStateRef.current = { selectedPosition, isLoading, isLoadingMore, hasMore };
  }, [selectedPosition, isLoading, isLoadingMore, hasMore]);

  // 카드 로드: 첫 페이지는 excludeUserIds 제외, 더보기만 적용
  const loadCards = useCallback(
    async (isMore: boolean = false) => {
      try {
        if (isMore) setIsLoadingMore(true);
        else setIsLoading(true);

        setHasError(null);

        const { selectedPosition: currentPosition } = currentStateRef.current;

        const params: Record<string, any> = { size: PAGE_SIZE };
        if (currentPosition !== null) params.position = currentPosition;
        if (isMore && excludeUserIds) params.excludeUserIds = excludeUserIds;

        const newCards = await getUserCards(params);

        if (newCards.length < PAGE_SIZE) setHasMore(false);
        if (newCards.length === 0) {
          setHasMore(false);
          return;
        }

        if (isMore) {
          setCards((prev) => {
            const seen = new Set(prev.map((c) => c.userId));
            const deduped = newCards.filter((c) => !seen.has(c.userId));
            if (deduped.length === 0) {
              setHasMore(false);
              return prev;
            }
            return [...prev, ...deduped];
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

  // 옵저버
  useEffect(() => {
    const el = observerTarget.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreCards();
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [loadMoreCards]);

  // 필터 열기/닫기/변경
  const handleFilterClick = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);
  const handlePositionChange = (position: PositionFilter) => setSelectedPosition(position);

  // ✅ 적용 시 선택값을 직접 받아서 ref와 state를 "즉시" 동기화 후 로드
  const handleFilterApply = (nextPosition: PositionFilter) => {
    console.log('🔄 필터 적용 시작:', nextPosition);

    // 1) 현재 참조값을 먼저 갱신 (loadCards가 즉시 올바른 값 사용)
    currentStateRef.current.selectedPosition = nextPosition;

    // 2) 리액트 상태도 갱신 (다음 렌더 반영)
    setSelectedPosition(nextPosition);

    // 3) 상태 초기화
    setCards([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setHasError(null);
    setIsFilterOpen(false);

    // 4) 첫 페이지 바로 로드 (excludeUserIds 없이)
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

  const handleChatClick = async (userId: number) => {
    try {
      await startChat(userId);
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      toast.error('예기치 못한 오류로 채팅을 시작하지 못했어요.');
    }
  };

  const handleCardClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  // 로딩/에러/빈 상태 UI
  if (isLoading && cards.length === 0) {
    return (
      <div className="min-h-dvh">
        <ExploreHeader onFilterClick={handleFilterClick} />
        <div className="mx-auto max-w-screen-md p-4">
          <LoadingSpinner text="새로운 프로필을 찾는 중..." size={120} className="min-h-[60vh]" />
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
    <div className="min-h-dvh pb-15">
      <ExploreHeader onFilterClick={handleFilterClick} />

      <div className="mx-auto max-w-screen-md p-4">
        <div className="space-y-6">
          {cards.map((card) => (
            <div
              key={card.userId}
              onClick={(e) => {
                if (isInActionElement(e)) return;
                handleCardClick(card.userId);
              }}
              className="cursor-pointer"
            >
              {/* 참고: OtherProfileCard 내의 좋아요/채팅 버튼에 data-no-nav 속성을 달면 더욱 안전해요. */}
              <OtherProfileCard profile={card} onChatClick={handleChatClick} />
            </div>
          ))}
        </div>

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
              className="text-primary mt-2 underline"
            >
              새로운 추천 받기
            </button>
          </div>
        )}

        {cards.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <Image src="images/logo/tokit_loading.svg" alt="로고" width={100} height={100} className="mx-auto" />
            <div className="text-lg text-gray-600">추천할 프로필이 없습니다</div>
            <button onClick={() => loadCards()} className="text-primary mt-2 underline">
              새로고침
            </button>
          </div>
        )}
      </div>

      {/* ✅ onApply가 현재 선택된 포지션을 전달하도록 변경 필요 */}
      <FilterSlide
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
        onApply={handleFilterApply} // ← (nextPosition: PositionFilter) 인자 전달
      />
    </div>
  );
};
