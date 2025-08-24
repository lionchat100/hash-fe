'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCards } from '@/entities/user/api/getUserCards';
import { UserProfile } from '@/entities/user/model/types';
import { PositionFilter } from '@/widgets/explore/FilterDrawer';

const PAGE_SIZE = 10;

// 전역 상태를 위한 간단한 store (필요시 zustand로 교체 가능)
// - 참고: 모듈 전역 값은 HMR/다중 탭/코드 스플리팅 상황에서 일관성이 깨질 수 있음
// - 대안 1) Zustand store 사용
// - 대안 2) URL 쿼리로 selectedPosition 반영 (&position=FRONTEND)
let globalSelectedPosition: PositionFilter = null;

export const useExploreCards = () => {
  const router = useRouter();

  // 상태
  const [cards, setCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<PositionFilter>(globalSelectedPosition);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 중복/동시 요청 방지용 플래그 (StrictMode, IntersectionObserver의 잦은 트리거 대비)
  const inFlightRef = useRef<null | 'first' | 'more'>(null);

  // 요청 레이스 방지용 id
  const requestIdRef = useRef(0);

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
      // ✅ 동시/중복 로딩 방어
      if (inFlightRef.current) return;
      inFlightRef.current = isMore ? 'more' : 'first';

      const myRequestId = ++requestIdRef.current;

      try {
        if (isMore) {
          setIsLoadingMore(true);
          currentStateRef.current.isLoadingMore = true; // ref에도 즉시 반영
        } else {
          setIsLoading(true);
          currentStateRef.current.isLoading = true; // ref에도 즉시 반영
        }

        setHasError(null);

        const { selectedPosition: currentPosition } = currentStateRef.current;

        const params: Record<string, any> = { size: PAGE_SIZE };
        if (currentPosition !== null) params.position = currentPosition;
        if (isMore && excludeUserIds) params.excludeUserIds = excludeUserIds;

        const newCards = await getUserCards(params);

        // ❗ 최신 요청만 반영 (느린 이전 요청이 늦게 도착해도 무시)
        if (myRequestId !== requestIdRef.current) return;

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
        // ✅ 로딩 플래그/락 해제 (ref와 state 모두)
        inFlightRef.current = null;
        setIsLoading(false);
        setIsLoadingMore(false);
        currentStateRef.current.isLoading = false;
        currentStateRef.current.isLoadingMore = false;
      }
    },
    [excludeUserIds],
  );

  const loadMoreCards = useCallback(() => {
    const { isLoading, isLoadingMore, hasMore } = currentStateRef.current;
    // ✅ inFlightRef로 한 번 더 방어
    if (inFlightRef.current || !hasMore || isLoading || isLoadingMore) return;
    loadCards(true);
  }, [loadCards]);

  // 초기 로드 (React 18 StrictMode에서 2회 실행 방지)
  useEffect(() => {
    const didInit = { current: false };
    if (!didInit.current) {
      didInit.current = true;
      loadCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한 스크롤 옵저버
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

  const handleCardClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  // 필터 적용
  const applyFilter = useCallback(
    (nextPosition: PositionFilter) => {

      // 1) 전역 상태 갱신
      globalSelectedPosition = nextPosition;

      // 2) 현재 참조값을 먼저 갱신 (loadCards가 즉시 올바른 값 사용)
      currentStateRef.current.selectedPosition = nextPosition;

      // 3) 리액트 상태도 갱신 (다음 렌더 반영)
      setSelectedPosition(nextPosition);

      // 4) 상태 초기화
      setCards([]);
      setHasMore(true);
      setIsLoadingMore(false);
      setHasError(null);

      // 5) 진행 중 로딩이 있으면 무시되도록 요청 id 증가
      requestIdRef.current += 1;
      inFlightRef.current = null; // 혹시 남아있다면 해제

      // 6) 스크롤을 최상단으로 이동
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 7) 첫 페이지 바로 로드 (excludeUserIds 없이)
      loadCards(false);
    },
    [loadCards],
  );

  return {
    // 상태
    cards,
    isLoading,
    hasError,
    isLoadingMore,
    hasMore,
    selectedPosition,
    observerTarget,

    // 핸들러
    loadCards,
    handleCardClick,
    isInActionElement,
    applyFilter,
  };
};
