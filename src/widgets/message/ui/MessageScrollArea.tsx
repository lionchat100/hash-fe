'use client';

import { useEffect, useRef, useCallback, useMemo, useLayoutEffect, useState } from 'react';
import { useMessageQuery, MessageBubble, groupMessages } from '@/entities/message';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { Skeleton } from '@/shared/ui/Skeleton';

interface MessageScrollAreaProps {
  roomId: number;
  className?: string;
}

const TOP_THRESHOLD = 100; // 상단 임계값
const BOTTOM_THRESHOLD = 120; // 하단 임계값

export const MessageScrollArea = ({ roomId, className }: MessageScrollAreaProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useMessageQuery(roomId);

  // 메시지 평탄화 / 그룹화 (메모이즈)
  const allMessages = useMemo(() => (data?.pages ? data.pages.flat() : []), [data?.pages]);
  const groupedMessages = useMemo(() => groupMessages(allMessages), [allMessages]);

  const handleScroll = useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // 상단 임계값 체크
    if (scrollTop < TOP_THRESHOLD && hasNextPage && !isFetchingNextPage) {
      const before = element.scrollHeight;
      fetchNextPage().then(() => {
        const after = element.scrollHeight;
        element.scrollTop = element.scrollTop + (after - before);
      });
    }

    // 하단 임계값 체크
    const distFromBottom = scrollHeight - (scrollTop + clientHeight);
    setIsNearBottom(distFromBottom < BOTTOM_THRESHOLD);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 방 진입/전환 시 한 번 바닥으로
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
      setIsNearBottom(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 새 데이터 수신 시: 사용자가 바닥 근처일 때만 자동 하단 스크롤
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    if (isFetchingNextPage) return;
    if (isNearBottom) {
      element.scrollTop = element.scrollHeight;
    }
  }, [data?.pages, isFetchingNextPage, isNearBottom]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={`flex-1 overflow-hidden ${className}`}>
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className={`flex-1 overflow-hidden ${className}`}>
        <ScrollArea className="h-full">
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">메시지를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // 메시지가 없을 때
  if (!data || data.pages.length === 0 || allMessages.length === 0) {
    return (
      <div className={`flex-1 overflow-hidden ${className}`}>
        <ScrollArea className="h-full">
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">아직 메시지가 없습니다.</p>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-hidden ${className}`}>
      <ScrollArea className="h-full" ref={viewportRef} onScroll={handleScroll} viewportClassName="overflow-y-auto">
        {/* 상단 로딩 인디케이터 */}
        <div className="sticky top-0 z-10 flex justify-center">
          {isFetchingNextPage && (
            <div className="bg-background/80 mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 backdrop-blur">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2" />
              <span className="text-muted-foreground text-xs">메시지를 불러오는 중…</span>
            </div>
          )}
        </div>

        {/* 메시지 목록 */}
        {groupedMessages.map((groupedMessage) => (
          <MessageBubble
            key={groupedMessage.message.messageId}
            message={groupedMessage.message}
            showAvatar={groupedMessage.showAvatar}
            showName={groupedMessage.showName}
            showTime={groupedMessage.showTime}
            isGrouped={groupedMessage.isGrouped}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
