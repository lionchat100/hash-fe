'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useMessageQuery, MessageBubble, groupMessages } from '@/entities/message';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';
import { PolicyCard } from '@/shared/ui/PolicyCard';

type Props = { roomId: number; currentUserId: number };

const BASE_INDEX = 100_000;
const BOTTOM_EPS = 30;

export function MessageScrollArea({ roomId, currentUserId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useMessageQuery(roomId);

  const all = useMemo(() => (data?.pages ? data.pages.flat().slice().reverse() : []), [data?.pages]);
  const items = useMemo(() => groupMessages(all), [all]);

  const [firstItemIndex, setFirstItemIndex] = useState(BASE_INDEX);
  const prevLenRef = useRef(0);
  const expectPrependRef = useRef(false);

  const virtRef = useRef<VirtuosoHandle | null>(null);
  const scrollerElRef = useRef<HTMLElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const lastMsgIdRef = useRef<string | number | null>(null);

  const loadMoreTop = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    expectPrependRef.current = true;
    fetchNextPage();
  };

  useEffect(() => {
    const prev = prevLenRef.current;
    const curr = items.length;
    const delta = curr - prev;

    if (delta > 0 && expectPrependRef.current) {
      setFirstItemIndex((idx) => idx - delta);
      expectPrependRef.current = false;
    }
    prevLenRef.current = curr;
  }, [items.length]);

  const isNearBottom = () => {
    const el = scrollerElRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= BOTTOM_EPS;
  };

  useEffect(() => {
    if (items.length === 0) {
      lastMsgIdRef.current = null;
      return;
    }
    const last = items[items.length - 1]?.message ?? items[items.length - 1];
    const currId = last?.messageId ?? last?.id;
    const changed = lastMsgIdRef.current !== null && currId !== lastMsgIdRef.current;
    lastMsgIdRef.current = currId;
    if (!changed) return;
    if ((atBottom || isNearBottom()) && virtRef.current) {
      const index = firstItemIndex + items.length - 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          virtRef.current!.scrollToIndex({ index, align: 'end', behavior: 'auto' });
        });
      });
    }
  }, [items, items.length, atBottom, firstItemIndex]);

  if (error) return <div className="h-full overflow-y-auto p-3 text-sm text-red-600">메시지 로드 오류</div>;
  if (isLoading) return <FallbackScreen type="loading" fullScreen />;

  return (
    <div className="scrollbar-hide h-dvh overflow-y-hidden">
      <div className="pt-[54px] pb-[56px]">
        {items.length === 0 ? <PolicyCard /> : null}
        <Virtuoso
          ref={virtRef}
          data={items}
          style={{ height: '100%' }}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={firstItemIndex + items.length - 1}
          followOutput={atBottom ? 'auto' : false}
          atTopStateChange={(atTop) => {
            if (atTop) loadMoreTop();
          }}
          atBottomStateChange={(val) => {
            if (!val && isNearBottom()) {
              setAtBottom(true);
            } else {
              setAtBottom(val);
            }
          }}
          scrollerRef={(el) => {
            scrollerElRef.current = (el as HTMLElement) ?? null;
          }}
          increaseViewportBy={{ top: 0, bottom: 200 }}
          overscan={300}
          computeItemKey={(index, g) => g.message.messageId}
          itemContent={(index, g) => (
            <MessageBubble key={g.message.messageId} {...g} message={g.message} currentUserId={currentUserId} />
          )}
          components={{
            Header: () =>
              isFetchingNextPage ? (
                <div className="p-3 text-center text-xs text-stone-600">이전 메시지를 불러오고 있어요</div>
              ) : null,
            Footer: () => <div style={{ height: atBottom ? 0 : 12 }} />,
          }}
        />
      </div>
    </div>
  );
}
