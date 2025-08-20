'use client';

import { useMemo, useCallback, useLayoutEffect, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMessageQuery, MessageBubble, groupMessages } from '@/entities/message';
import { ScrollArea } from '@/shared/ui/ScrollArea';

export function MessageScrollArea({ roomId, className }: { roomId: number; className?: string }) {
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false); // 요청 중복 방지 플래그

  // 콜백 ref: Viewport DOM을 state에 저장(리렌더 유도)
  const attachViewportRef = useCallback((element: HTMLDivElement | null) => {
    setRootElement(element);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useMessageQuery(roomId);

  // 상단 센티널
  const { ref: topRef, inView: topInView } = useInView({
    root: rootElement ?? undefined,
    rootMargin: '100px 0px 0px 0px',
    threshold: 0,
    // root가 준비될 때까지 옵저버 attach를 건너뜀
    skip: !rootElement,
  });

  // 하단 센티널(바닥 근처 자동 스크롤 판단용)
  const { ref: bottomRef, inView: bottomInView } = useInView({
    root: rootElement ?? undefined,
    rootMargin: '0px 0px 120px 0px',
    threshold: 0,
    skip: !rootElement,
  });

  // 렌더 후 스크롤 보정
  const fixScrollAfterAppend = useCallback(
    (before: number) => {
      if (!rootElement) return;
      requestAnimationFrame(() => {
        const after = rootElement.scrollHeight;
        rootElement.scrollTop = rootElement.scrollTop + (after - before);
      });
    },
    [rootElement],
  );

  // 초기 렌더 후 상태 초기화
  useEffect(() => {
    if (data && !isLoading) {
      setIsInitialRender(false);
    }
  }, [data, isLoading]);

  // 상단 노출 시 다음 페이지 로드
  useEffect(() => {
    console.log('[상단 센티널] 상태 체크:', {
      topInView,
      hasNextPage,
      isFetchingNextPage,
      rootElement: !!rootElement,
      isRequesting,
    });
    if (isInitialRender || !topInView || !hasNextPage || isFetchingNextPage || !rootElement || isRequesting) return;
    const before = rootElement.scrollHeight;
    setIsRequesting(true);

    fetchNextPage()
      .then(() => fixScrollAfterAppend(before))
      .catch(console.error)
      .finally(() => setTimeout(() => setIsRequesting(false), 500));
  }, [topInView, hasNextPage, isFetchingNextPage, rootElement, fetchNextPage, fixScrollAfterAppend, isRequesting]);

  // 데이터 정렬
  const allMessages = useMemo(() => (data?.pages ? data.pages.flat().slice().reverse() : []), [data?.pages]);
  const grouped = useMemo(() => groupMessages(allMessages), [allMessages]);

  // 방 진입 시 바닥으로
  useLayoutEffect(() => {
    if (!rootElement) return;
    requestAnimationFrame(() => {
      rootElement.scrollTop = rootElement.scrollHeight;
    });
  }, [roomId, rootElement]);

  // 새 메시지 수신 시 자동 스크롤 (사용자가 바닥 근처에 있을 때만)
  useEffect(() => {
    if (!rootElement || isFetchingNextPage) return;
    if (bottomInView) {
      requestAnimationFrame(() => {
        rootElement.scrollTop = rootElement.scrollHeight;
      });
    }
  }, [data?.pages, isFetchingNextPage, bottomInView, rootElement]);

  return (
    <div className={`min-h-0 flex-1 overflow-hidden ${className}`}>
      <ScrollArea className="h-full" viewportRef={attachViewportRef} viewportClassName="overflow-y-auto">
        {/* 상단 센티널: 보이면 과거 페이지 로드 */}
        {hasNextPage && <div ref={topRef} className="h-1 w-full" aria-hidden />}

        {/* 상단 로딩 인디케이터 */}
        <div className="sticky top-0 z-10 flex justify-center">
          {isFetchingNextPage && (
            <div className="bg-background/80 mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 backdrop-blur">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2" />
              <span className="text-muted-foreground text-xs">이전 메시지 불러오는 중…</span>
            </div>
          )}
        </div>

        {grouped.map((g) => (
          <MessageBubble key={g.message.messageId} {...g} message={g.message} />
        ))}

        {/* 하단 센티널: 바닥 근처 판단 */}
        <div ref={bottomRef} className="h-1 w-full" aria-hidden />
      </ScrollArea>
    </div>
  );
}
