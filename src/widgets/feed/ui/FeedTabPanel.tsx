'use client';
import { useMemo } from 'react';
import { useFeedsInfinite, useTabScrollPreserver } from '@/features/update-feed/model/feedLoad';
import { Sort } from '@/entities/feed/model/types';
import { FeedCard } from '@/widgets/feed/ui/FeedCard';
import { useInView } from 'react-intersection-observer';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

export const FeedTabPanel = ({ sort, active }: { sort: Sort; active: boolean }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeedsInfinite(sort);
  const containerRef = useTabScrollPreserver(active);

  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  const isMyTab = sort === 'my';
  const items = useMemo(() => data?.pages.flatMap((p) => p.content) ?? [], [data]);
  const isEmpty = data?.pages.flatMap((page) => page.content).length === 0;

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh - 164px)] scrollbar-hide h-full w-full overflow-auto pb-[56px]"
      hidden={!active}
    >
      {isEmpty && (
        <div className="font-display-sm flex h-full w-full items-center justify-center">아직 게시판에 글이 없어요</div>
      )}
      {/* 상태 처리 */}
      {status === 'pending' && (
        <FallbackScreen text={`게시판 진입 대기중이에요\n조금만 기다려주세요`} fullScreen image="heart" />
      )}
      {status === 'error' && <div className="p-4 text-sm text-red-500">목록을 불러오지 못했습니다.</div>}

      {/* 리스트 */}
      {items.map((it) => (
        <FeedCard key={it.feed.id} item={it} sortMy={isMyTab} />
      ))}

      {/* 로딩 인디케이터/센티넬 */}
      <div ref={ref} className="h-1" />
      {isFetchingNextPage && <div className="p-3 text-center text-xs text-stone-600">더 불러오는 중…</div>}
      {!hasNextPage && items.length > 0 && (
        <div className="p-3 text-center text-xs text-stone-600">마지막 글입니다</div>
      )}
    </div>
  );
};
