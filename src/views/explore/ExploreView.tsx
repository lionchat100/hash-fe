// ✅ 변경 파일: ExploreView.tsx (질문에서 준 마지막 버전 기준)

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

const PAGE_SIZE = 10; // [추가] 요청 단위 고정

export const ExploreView = () => {
  const router = useRouter();

  const [cards, setCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionFilter>(null);
  const { startChat, isLoading: isChatLoading } = useChatStartOnExplore();

  const observerTarget = useRef<HTMLDivElement>(null);

  // [추가] 카드 내부 액션 클릭이면 내비게이션 막기
  const isInActionElement = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement | null;
    // button, a, role="button", data-no-nav 중 하나라도 조상에 있으면 상세 이동 금지
    return !!el?.closest('button, a, [role="button"], [data-no-nav]');
  };

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
          if (currentPosition === null) {
            // 전체 추천 (클러스터링 기반)
            return await getUserCards({
              size: PAGE_SIZE,
              excludeUserIds,
            });
          } else {
            // 포지션별 필터링 추천 (API 문서의 category 엔드포인트 사용)
            return await getUserCards({
              size: PAGE_SIZE,
              position: currentPosition,
              excludeUserIds,
            });
          }
        };

        const newCards = await fetch();

        // [변경] 끝 검출: 요청한 크기보다 작으면 더 없음
        if (newCards.length < PAGE_SIZE) {
          setHasMore(false);
        }

        if (newCards.length === 0) {
          return;
        }

        if (isMore) {
          // [보완] 혹시 서버가 exclude를 못 지켜도 프론트에서 한 번 더 중복 제거
          setCards((prev) => {
            const seen = new Set(prev.map((c) => c.userId));
            const deduped = newCards.filter((c) => !seen.has(c.userId));

            // [추가] 신규 아이템이 0개면 더 이상 불러오지 않도록 종료
            if (deduped.length === 0) {
              setHasMore(false);
              return prev;
            }

            return [...prev, ...deduped];
          });
        } else {
          // 첫 로드 또는 필터 변경 시 새로 설정
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
    [excludeUserIds], // [변경] 제외 목록이 바뀌면 로딩 함수 갱신
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

  // selectedPosition 변경 시 필터링 재적용
  useEffect(() => {
    // 빈 카드 상태일 때만 새로 로드 (필터 적용 후 상황)
    if (cards.length === 0 && !isLoading) {
      loadCards(false);
    }
  }, [selectedPosition, cards.length, isLoading, loadCards]);

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
    console.log('🔄 필터 적용 시작:');
    console.log('  - 선택된 포지션:', selectedPosition);
    console.log('  - 현재 카드 수:', cards.length);

    // [보완] 상태 초기화 후 새 필터로 다시 로드
    setCards([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setHasError(null);
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
                // ★ 버튼/링크 등을 클릭했을 땐 상세 페이지로 이동하지 않음
                if (isInActionElement(e)) return;
                handleCardClick(card.userId);
              }}
              className="cursor-pointer"
            >
              {/* 참고: OtherProfileCard 내의 좋아요/채팅 버튼에 data-no-nav 속성을 달면 더욱 안전해요. */}
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
