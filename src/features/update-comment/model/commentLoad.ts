import { getCommentList } from '@/entities/comment/api/getCommentList';
import { CommentRes, PageParam } from '@/entities/comment/model/types';
import { useInfiniteQuery } from '@tanstack/react-query';

const getNextCursor = (lastPage: CommentRes): PageParam | undefined => {
  // 다음 데이터 없음
  if (lastPage.last) return undefined;

  const items = lastPage.content;
  if (!items.length) return undefined;

  const lastItem = items[items.length - 1];

  return { lastId: lastItem.id };
};

export function useCommentsInfinite(feedId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['comments', feedId],
    enabled,
    queryFn: ({ pageParam }) => getCommentList(feedId, pageParam as PageParam),
    initialPageParam: undefined as PageParam | undefined,
    getNextPageParam: (lastPage) => getNextCursor(lastPage),
  });
}
