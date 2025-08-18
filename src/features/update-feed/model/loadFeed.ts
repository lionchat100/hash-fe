import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeedList } from '@/entities/feed/api/getFeedList';
import { FeedRes, Sort, Cursor } from '@/entities/feed/model/types';

function getNextCursor(sort: Sort, lastPage: FeedRes): Cursor | undefined {
  // 다음 데이터 없음
  if (lastPage.last === false) return undefined;

  const items = lastPage.content;
  if (!items.length) return undefined;

  const lastItem = items[items.length - 1].feed;

  if (sort === 'popular') {
    return { lastLikeCount: lastItem.likeCount, lastId: lastItem.id };
  }

  // sort : lastst | my
  return { lastId: lastItem.id };
}

export function useFeedsInfinite(sort: Sort) {
  return useInfiniteQuery({
    queryKey: ['feeds', sort], // 탭(정렬) 바뀌면 캐시 분리
    queryFn: ({ pageParam }) => getFeedList(sort, pageParam as Cursor | undefined),
    initialPageParam: undefined as Cursor | undefined, // 첫 페이지: 커서 없음
    getNextPageParam: (lastPage) => getNextCursor(sort, lastPage),
  });
}
