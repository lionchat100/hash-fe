import { Sort, FeedItem, Feed, FeedRes } from '@/entities/feed/model/types';
import { InfiniteData, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { likeFeed, unlikeFeed } from '../api/updateFeedLike';
import { useCallback, useRef, useState } from 'react';

const FEED_TABS: Sort[] = ['latest', 'popular', 'my'];

// 한 탭 캐시에서 해당 feed 업데이트
const updateFeedInInfiniteCache = (qc: QueryClient, sort: Sort, feedId: number, updater: (f: FeedItem) => FeedItem) => {
  qc.setQueryData<InfiniteData<FeedRes>>(['feeds', sort], (old) => {
    if (!old) return old;
    const pages = old.pages.map((page) => ({
      ...page,
      content: page.content.map((it) => (it.feed.id === feedId ? updater(it) : it)),
    }));
    return { ...old, pages };
  });
};

// 클릭한 탭 캐시 안에서 찾아서 반환
export const findInInfiniteCache = (qc: QueryClient, sort: Sort, id: number): Feed | undefined => {
  const data = qc.getQueryData<InfiniteData<FeedRes>>(['feeds', sort]);

  if (!data) return;
  for (const p of data.pages) {
    const hit = p.content.find((x) => x.feed.id === id);
    if (hit) return hit.feed;
  }
  return;
};

// 세 탭에 일괄 적용
export const updateFeedInAllTabs = (
  qc: QueryClient,
  feedId: number,
  updater: (item: FeedItem) => FeedItem,
  tabs: Sort[] = FEED_TABS,
) => {
  tabs.forEach((s) => updateFeedInInfiniteCache(qc, s, feedId, updater));
};

export const useCoalescedToggleLike = (id: number, debounceMs = 450) => {
  const qc = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  // 초기 스냅샷(캐시 기준)
  const current =
    findInInfiniteCache(qc, 'latest', id) ??
    findInInfiniteCache(qc, 'popular', id) ??
    findInInfiniteCache(qc, 'my', id);

  // 서버가 알고 있다고 "추정"하는 마지막 상태와, 유저의 "마지막 의도"
  const serverLikedRef = useRef<boolean>(!!current?.isLiked);
  const pendingIntentRef = useRef<boolean>(!!current?.isLiked);

  // 제어용
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const dirtyRef = useRef(false);

  // optimistic 적용(세 탭 동기화)
  const applyOptimistic = useCallback(
    (nextLiked: boolean) => {
      updateFeedInAllTabs(qc, id, (it) => {
        const nextCount = Math.max(0, it.feed.likeCount + (nextLiked ? 1 : -1));
        return { ...it, feed: { ...it.feed, isLiked: nextLiked, likeCount: nextCount } };
      });
    },
    [qc, id],
  );

  // 실패 시 서버 권위로 정합화
  const rollbackByInvalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['feeds', 'latest'], refetchType: 'inactive' });
    qc.invalidateQueries({ queryKey: ['feeds', 'my'], refetchType: 'inactive' });
    qc.invalidateQueries({ queryKey: ['feeds', 'popular'] });
  }, [qc]);

  // mutate 함수 (toLike에 따라 API 분기)
  const mutation = useMutation({
    mutationKey: ['feed-like', id],
    mutationFn: async ({ toLike }: { toLike: boolean }) => (toLike ? likeFeed({ id }) : unlikeFeed({ id })),
  });

  // 마지막 의도를 서버에 동기화
  const flush = useCallback(async () => {
    if (inFlightRef.current) {
      dirtyRef.current = true;
      return;
    }
    const desired = pendingIntentRef.current;
    if (desired === serverLikedRef.current) return; // 불필요한 전송 방지

    inFlightRef.current = true;
    setSyncing(true);
    try {
      await mutation.mutateAsync({ toLike: desired });
      serverLikedRef.current = desired; // 서버 스냅샷 갱신
    } catch (_e) {
      // 실패 → invalidate로 정합화(optimistic은 캐시에서 되돌아감)
      rollbackByInvalidate();
    } finally {
      setSyncing(false);
      inFlightRef.current = false;
      if (dirtyRef.current) {
        dirtyRef.current = false;
        // 직후 즉시 재‑flush (디바운스 없이)
        flush();
      }
    }
  }, [mutation, rollbackByInvalidate]);

  // 공개 토글: 의도만 최신으로 갱신, 디바운스 종료 시 flush
  const toggle = useCallback(() => {
    const next = !pendingIntentRef.current;
    pendingIntentRef.current = next;
    applyOptimistic(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      flush();
    }, debounceMs);
  }, [applyOptimistic, flush, debounceMs]);

  return { toggle, syncing };
};
