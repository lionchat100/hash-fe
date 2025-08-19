'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { ExploreHeader } from '@/widgets/explore/ExploreHeader';
import { FilterSlide, PositionFilter } from '@/widgets/explore/FilterSlide';
import { getUserCards, getUserCardsByPosition } from '@/entities/user/api/getUserCards';
import { UserProfile } from '@/entities/user/model/types';

export const ExploreView = () => {
  const router = useRouter();

  // 상태 관리
  const [cards, setCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 페이지 로드 횟수 추적 (서버 캐시와 구분용)
  const [loadCount, setLoadCount] = useState(0);

  // 필터 관련 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionFilter>('ALL');

  // 무한스크롤을 위한 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  // 최신 상태를 참조하기 위한 ref
  const currentStateRef = useRef({ selectedPosition, isLoadingMore, hasMore });

  // ref 업데이트
  useEffect(() => {
    currentStateRef.current = { selectedPosition, isLoadingMore, hasMore };
  }, [selectedPosition, isLoadingMore, hasMore]);

  // 카드 로드 함수 - 초기 로드 및 필터 변경용
  const loadCards = useCallback(async (isMore: boolean = false) => {
    try {
      if (isMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setHasError(null);

      // 현재 selectedPosition 상태를 직접 참조
      const currentPosition = currentStateRef.current.selectedPosition;

      // 포지션 필터에 따라 다른 API 호출
      const newCards =
        currentPosition === 'ALL'
          ? await getUserCards({ size: 10 })
          : await getUserCardsByPosition(currentPosition, 10);

      if (newCards.length === 0) {
        setHasMore(false);
        return;
      }

      if (isMore) {
        setCards((prev) => [...prev, ...newCards]);
      } else {
        setCards(newCards);
        setLoadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('카드 로드 실패:', error);
      setHasError(error instanceof Error ? error.message : '카드를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // 무한스크롤 전용 함수
  const loadMoreCards = useCallback(() => {
    const { isLoadingMore, hasMore } = currentStateRef.current;
    if (!isLoadingMore && hasMore) {
      loadCards(true);
    }
  }, [loadCards]);

  // 초기 카드 로드
  useEffect(() => {
    loadCards();
  }, []);

  // 무한스크롤 구현 - 의존성 최소화
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMoreCards();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreCards]); // 의존성 대폭 감소!

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async (userId: number, currentLikeState: boolean) => {
    try {
      console.log(`${currentLikeState ? '좋아요 취소' : '좋아요'} 요청: 사용자 ${userId}`);

      // TODO: 실제 좋아요 API 호출
      // const result = await toggleUserLike(userId);

      // 임시: 해당 카드의 좋아요 상태 토글
      setCards((prev) =>
        prev.map((card) => (card.userId === userId ? { ...card, isLikedByMe: !currentLikeState } : card)),
      );

      console.log(`✅ 좋아요 상태 변경 완료: ${!currentLikeState}`);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      throw error;
    }
  };

  // 채팅 시작 버튼 클릭 핸들러
  const handleChatClick = async (userId: number) => {
    try {
      console.log(`채팅 시작 요청: 사용자 ${userId}`);

      // TODO: 실제 채팅방 생성 API 호출
      // const chatRoom = await createChatRoom(userId);
      // router.push(`/chat/${chatRoom.id}`);

      console.log(`✅ 채팅방 생성 요청 완료 (구현 예정)`);
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      throw error;
    }
  };

  // 카드 클릭 시 프로필 상세 페이지로 이동
  const handleCardClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  // 필터 버튼 클릭 핸들러
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  // 필터 닫기 핸들러
  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  // 포지션 필터 변경 핸들러
  const handlePositionChange = (position: PositionFilter) => {
    setSelectedPosition(position);
  };

  // 필터 적용 핸들러
  const handleFilterApply = () => {
    // 무한스크롤 상태 리셋
    setHasMore(true);
    setIsLoadingMore(false);
    setHasError(null);

    // 새로운 필터로 카드를 다시 로드
    loadCards(false);
  };

  // 로딩 중 UI
  if (isLoading && cards.length === 0) {
    return (
      <div className="mx-auto max-w-screen-md p-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg text-gray-600">새로운 프로필을 찾는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
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
      {/* 탐색 페이지 헤더 */}
      <ExploreHeader onFilterClick={handleFilterClick} />

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-screen-md p-4">
        {/* 카드 리스트 */}
        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card.userId} onClick={() => handleCardClick(card.userId)} className="cursor-pointer">
              <OtherProfileCard profile={card} onLikeClick={handleLikeClick} onChatClick={handleChatClick} />
            </div>
          ))}
        </div>

        {/* 무한스크롤 트리거 */}
        <div ref={observerTarget} className="h-4" />

        {/* 더 로딩 중 표시 */}
        {isLoadingMore && (
          <div className="py-8 text-center">
            <div className="text-gray-600">더 많은 프로필을 불러오는 중...</div>
          </div>
        )}

        {/* 더 이상 불러올 카드가 없을 때 */}
        {!hasMore && cards.length > 0 && (
          <div className="py-8 text-center">
            <div className="text-gray-500">모든 추천 프로필을 확인했습니다</div>
            <button
              onClick={() => {
                setHasMore(true);
                loadCards();
              }}
              className="mt-2 text-blue-600 underline"
            >
              새로운 추천 받기
            </button>
          </div>
        )}

        {/* 카드가 하나도 없을 때 */}
        {cards.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="text-lg text-gray-600">추천할 프로필이 없습니다</div>
            <button onClick={() => loadCards()} className="mt-2 text-blue-600 underline">
              새로고침
            </button>
          </div>
        )}
      </div>

      {/* 필터 슬라이드 */}
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
