'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFeedsInfinite, useTabScrollPreserver } from '@/features/update-feed/model/loadFeed';
import { Sort } from '@/entities/feed/model/types';
import { FeedCard } from '@/widgets/feed/ui/FeedCard';
import { ScrollArea } from '@/shared/ui/ScrollArea';

export const FeedTabPanel = ({ sort, active }: { sort: Sort; active: boolean }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeedsInfinite(sort);
  const containerRef = useTabScrollPreserver(active);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 교차 관찰자: sentinel 보이면 다음 페이지 요청
  useEffect(() => {
    if (!active || !sentinelRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [active, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = useMemo(() => data?.pages.flatMap((p) => p.content) ?? [], [data]);

  return (
    <ScrollArea ref={containerRef} className="h-[calc(100vh - 164px)] overflow-auto pb-[56px]" hidden={!active}>
      {/* 상태 처리 */}
      {status === 'pending' && <div className="text-muted-foreground p-4 text-sm">불러오는 중…</div>}
      {status === 'error' && <div className="p-4 text-sm text-red-500">목록을 불러오지 못했습니다.</div>}

      {/* 리스트 */}
      {items.map((it) => (
        <FeedCard key={it.feed.id} item={it} />
      ))}

      {/* 로딩 인디케이터/센티넬 */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && <div className="text-muted-foreground p-3 text-center text-xs">더 불러오는 중…</div>}
      {!hasNextPage && items.length > 0 && (
        <div className="text-muted-foreground p-3 text-center text-xs">마지막 글입니다.</div>
      )}
    </ScrollArea>
  );
};
