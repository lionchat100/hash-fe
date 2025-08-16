import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeedList } from '@/entities/feed/api/getFeedList';
import { FeedPageResponse } from '@/entities/feed/model/types';

function getNextPageParam(lastPage: FeedPageResponse) {
  const items = lastPage.content;
  if (!items.length) return undefined; // 더 없음

  // 백엔드가 hasNext를 준다면 그걸 쓰는 게 베스트
  // if (lastPage.hasNext === false) return undefined;

  // 커서 = "현재 페이지의 마지막 아이템 id"
  const lastItemId = items[items.length - 1].feed.id;
  // 다음 요청 파라미터로 사용할 값 리턴
  return lastItemId;
}

export function useFeedsInfinite(sort: 'latest' | 'popular') {
  return useInfiniteQuery({
    queryKey: ['feeds', sort], // 탭(정렬) 바뀌면 캐시 분리
    queryFn: ({ pageParam }) => getFeedList({ pageParam, sort }),
    initialPageParam: null, // 첫 요청은 lastId 없이
    getNextPageParam,
  });
}
