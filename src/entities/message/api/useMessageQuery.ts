import { MESSAGE_PAGE_SIZE } from '@/shared/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageList, getMessageList, getMoreMessageList } from '..';

export const useMessageQuery = (roomId: number) => {
  return useInfiniteQuery<MessageList, Error>({
    queryKey: ['messages', roomId],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      return pageParam == null ? getMessageList(roomId) : getMoreMessageList(roomId, pageParam as string);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < MESSAGE_PAGE_SIZE) return undefined;
      if (lastPage.some((m) => m.isEnd)) return undefined;
      return lastPage[lastPage.length - 1].messageId;
    },
    select: (data) => {
      const seen = new Set<string>();
      const pages = data.pages.map((items) => {
        const out: MessageList = [];
        for (const m of items) {
          if (!seen.has(m.messageId)) {
            seen.add(m.messageId);
            out.push(m);
          }
        }
        return out;
      });
      return { ...data, pages } as typeof data;
    },
    staleTime: 30_000, // 30초
    gcTime: 10 * 60 * 1000, // 10분
  });
};
