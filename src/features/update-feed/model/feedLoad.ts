import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeedList } from '@/entities/feed/api/getFeedList';
import { FeedRes, Sort, Cursor } from '@/entities/feed/model/types';

const getNextCursor = (sort: Sort, lastPage: FeedRes): Cursor | undefined => {
  // 다음 데이터 없음
  if (lastPage.last === true) return undefined;

  const items = lastPage.content;
  if (!items.length) return undefined;

  const lastItem = items[items.length - 1].feed;

  if (sort === 'popular') {
    return { lastLikeCount: lastItem.likeCount, lastId: lastItem.id };
  }

  // sort : lastst | my
  return { lastId: lastItem.id };
};

export const useFeedsInfinite = (sort: Sort) => {
  return useInfiniteQuery({
    queryKey: ['feeds', sort], // 탭(정렬) 바뀌면 캐시 분리
    queryFn: ({ pageParam }) => getFeedList(sort, pageParam as Cursor | undefined),
    initialPageParam: undefined as Cursor | undefined, // 첫 페이지: 커서 없음
    getNextPageParam: (lastPage) => getNextCursor(sort, lastPage),
  });
};

export const useTabScrollPreserver = (active: boolean) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);

  // 숨겨지기 직전 스크롤 저장
  useEffect(() => {
    if (!containerRef.current) return;
    if (!active) {
      lastScrollTopRef.current = containerRef.current.scrollTop;
    }
  }, [active]);

  // 다시 보여질 때 스크롤 복구
  useEffect(() => {
    if (!containerRef.current) return;
    if (active) {
      containerRef.current.scrollTo({
        top: lastScrollTopRef.current,
        behavior: 'instant' as ScrollBehavior, // 브라우저 타입 경고 시 캐스팅
      });
    }
  }, [active]);

  return containerRef;
};
