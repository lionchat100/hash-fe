'use client';
import { useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNotificationStore } from '@/entities/notify/model/slice';
import { useNotificationsInfinite } from '@/features/update-notify/model/notificationLoad';
import { typeToCardData } from '@/entities/notify/libs/notifyDataMapper';
import { NotifyCard } from '@/entities/notify/ui/NotifyCard';

export const NotifyList = () => {
  const clearDot = useNotificationStore((s) => s.clear);

  useEffect(() => {
    clearDot();
  }, [clearDot]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useNotificationsInfinite();

  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  const items = useMemo(
    () =>
      data?.pages.flatMap((p) =>
        p.content.map((item) => ({
          ...typeToCardData(item),
          id: item.id,
          nickname: item.senderNickName,
        })),
      ) ?? [],
    [data],
  );

  return (
    <div className="h-[calc(100dvh - 164px)] scrollbar-hide w-full overflow-auto pb-[56px]">
      {/* 상태 처리 */}
      {status === 'pending' && <div className="text-muted-foreground p-4 text-sm">불러오는 중…</div>}
      {status === 'error' && <div className="p-4 text-sm text-red-500">목록을 불러오지 못했습니다.</div>}

      <div className="p-4">
        {/* 리스트 */}
        {items.map((it) => (
          <NotifyCard key={it.id} item={it} />
        ))}
      </div>

      {/* 로딩 인디케이터/센티넬 */}
      <div ref={ref} className="h-1" />
      {isFetchingNextPage && <div className="text-muted-foreground p-3 text-center text-xs">더 불러오는 중…</div>}
      {!hasNextPage && items.length > 0 && (
        <div className="text-muted-foreground p-3 text-center text-xs">마지막 글입니다</div>
      )}
    </div>
  );
};
