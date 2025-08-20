import { useInfiniteQuery } from '@tanstack/react-query';
import { NotificationRes, Cursor } from '@/entities/notify/model/types';
import { PAGE_SIZE } from '@/shared/constants/constant';
import { getNotificationList } from '@/entities/notify/api/getNotificationList';

export function getNextCursor(lastPage: NotificationRes): Cursor | undefined {
  if (lastPage.last) return undefined;
  const lastItem = lastPage.content[lastPage.content.length - 1];
  if (!lastItem) return undefined;
  return { lastId: lastItem.id, size: PAGE_SIZE };
}

export const useNotificationsInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => getNotificationList(pageParam as Cursor | undefined),
    initialPageParam: { size: 20 } as Cursor, // 첫 페이지도 size 넣어줌
    getNextPageParam: (lastPage) => getNextCursor(lastPage),
  });
};
