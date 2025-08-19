import { Sort, FeedItem, Feed, FeedRes } from '@/entities/feed/model/types';
import { InfiniteData, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { likeFeed, unlikeFeed } from '../api/updateFeedLike';

const FEED_TABS: Sort[] = ['latest', 'popular', 'my'];

// 한 탭 캐시에서 해당 feed 업데이트
function updateFeedInInfiniteCache(qc: QueryClient, sort: Sort, feedId: number, updater: (f: FeedItem) => FeedItem) {
  qc.setQueryData<InfiniteData<FeedRes>>(['feeds', sort], (old) => {
    if (!old) return old;
    const pages = old.pages.map((page) => ({
      ...page,
      content: page.content.map((it) => (it.feed.id === feedId ? updater(it) : it)),
    }));
    return { ...old, pages };
  });
}

// 클릭한 탭 캐시 안에서 찾아서 반환
export function findInInfiniteCache(qc: QueryClient, sort: Sort, id: number): Feed | undefined {
  const data = qc.getQueryData<InfiniteData<FeedRes>>(['feeds', sort]);

  if (!data) return;
  for (const p of data.pages) {
    const hit = p.content.find((x) => x.feed.id === id);
    if (hit) return hit.feed;
  }
  return;
}

// 세 탭에 일괄 적용
export function updateFeedInAllTabs(
  qc: QueryClient,
  feedId: number,
  updater: (item: FeedItem) => FeedItem,
  tabs: Sort[] = FEED_TABS,
) {
  tabs.forEach((s) => updateFeedInInfiniteCache(qc, s, feedId, updater));
}

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const current =
        findInInfiniteCache(qc, 'latest', id) ??
        findInInfiniteCache(qc, 'popular', id) ??
        findInInfiniteCache(qc, 'my', id);

      const isLiked = current?.isLiked;

      console.log(`Toggling like for feed ${id}, currently liked: ${isLiked}`);

      if (isLiked) {
        console.log(`Unliking feed ${id}`);
        await unlikeFeed({ id });
      } else {
        console.log(`Liking feed ${id}`);
        await likeFeed({ id });
      }
    },
    onMutate: async ({ id }) => {
      // 1) 이전 상태 저장
      const prev = {
        latest: qc.getQueryData<InfiniteData<FeedRes>>(['feeds', 'latest']),
        popular: qc.getQueryData<InfiniteData<FeedRes>>(['feeds', 'popular']),
        my: qc.getQueryData<InfiniteData<FeedRes>>(['feeds', 'my']),
      };

      // 2) 현재 상태 확인
      const current =
        findInInfiniteCache(qc, 'latest', id) ??
        findInInfiniteCache(qc, 'popular', id) ??
        findInInfiniteCache(qc, 'my', id);

      const wasLiked = current?.isLiked;

      // 3) 낙관적 업데이트: 세 탭 모두 동기 반영
      updateFeedInAllTabs(qc, id, (it) => {
        const nextLiked = !wasLiked;
        const nextCount = Math.max(0, it.feed.likeCount + (nextLiked ? 1 : -1));
        return {
          ...it,
          feed: { ...it.feed, isLiked: nextLiked, likeCount: nextCount },
        };
      });

      // 4) 컨텍스트 반환(롤백용)
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // 롤백
      if (!ctx) return;
      if (ctx.prev.latest) qc.setQueryData(['feeds', 'latest'], ctx.prev.latest);
      if (ctx.prev.popular) qc.setQueryData(['feeds', 'popular'], ctx.prev.popular);
      if (ctx.prev.my) qc.setQueryData(['feeds', 'my'], ctx.prev.my);
    },
    onSettled: async () => {
      // 5) 서버 권위와 동기화
      qc.invalidateQueries({ queryKey: ['feeds', 'latest'], refetchType: 'inactive' });
      qc.invalidateQueries({ queryKey: ['feeds', 'my'], refetchType: 'inactive' });
      // 인기순은 정렬이 바뀔 수 있으니 확실히 새로고침
      qc.invalidateQueries({ queryKey: ['feeds', 'popular'] });
    },
  });
}
