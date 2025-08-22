'use client';

import { OtherProfileCard } from '@/widgets/profile/OtherProfileCard';
import { LoadingSpinner, InlineLoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { UserProfile } from '@/entities/user/model/types';
import Image from 'next/image';
import * as React from 'react';

type ObserverRef = React.RefObject<HTMLDivElement | null> | ((node: HTMLDivElement | null) => void);

type ExploreCardAreaProps = {
  cards: UserProfile[];
  isLoading: boolean;
  hasError: string | null;
  isLoadingMore: boolean;
  hasMore: boolean;
  observerTarget: ObserverRef;
  loadCards: () => void;
  handleCardClick: (userId: number) => void;
  isInActionElement: (e: React.MouseEvent) => boolean;
};

export const ExploreCardArea = ({
  cards,
  isLoading,
  hasError,
  isLoadingMore,
  hasMore,
  observerTarget,
  loadCards,
  handleCardClick,
  isInActionElement,
}: ExploreCardAreaProps) => {
  // 로딩 상태 UI
  if (isLoading && cards.length === 0) {
    return (
      <div className="mx-auto max-w-screen-md p-4">
        <LoadingSpinner text="새로운 프로필을 찾는 중..." size={120} className="min-h-[60vh]" />
      </div>
    );
  }

  // 에러 상태 UI
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
    <div className="mx-auto max-w-screen-md p-4">
      {/* 카드 리스트 */}
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
            <OtherProfileCard profile={card} />
          </div>
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={observerTarget} className="h-8" />

      {/* 더 로딩 중 */}
      {isLoadingMore && (
        <div className="py-8 text-center">
          <InlineLoadingSpinner text="더 많은 프로필을 불러오는 중..." />
        </div>
      )}

      {/* 모든 카드 로드 완료 */}
      {!hasMore && cards.length > 0 && (
        <div className="py-8 text-center">
          <div className="text-gray-500">모든 추천 프로필을 확인했습니다</div>
          <button
            onClick={() => {
              // 새로운 추천 받기 로직은 부모에서 처리하거나 별도 훅으로 분리 가능
              window.location.reload();
            }}
            className="text-primary mt-2 underline"
          >
            새로운 추천 받기
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {cards.length === 0 && !isLoading && (
        <div className="py-16 text-center">
          {/* public 자산이면 앞에 / 붙이는 게 안전 */}
          <Image src="/images/logo/tokit_loading.svg" alt="로고" width={100} height={100} className="mx-auto" />
          <div className="text-lg text-gray-600">추천할 프로필이 없습니다</div>
          <button onClick={() => loadCards()} className="text-primary mt-2 underline">
            새로고침
          </button>
        </div>
      )}
    </div>
  );
};
