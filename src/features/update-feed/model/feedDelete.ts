import { useMutation, useQueryClient, type InfiniteData, type QueryKey } from '@tanstack/react-query';
import { deleteFeed } from '@/features/update-feed/api/deleteFeed';
import { FeedRes } from '@/entities/feed/model/types';

type ListCache = InfiniteData<FeedRes>;
type SnapShot = [QueryKey, ListCache | undefined];

export function useDeleteFeed() {
  const qc = useQueryClient();

  return useMutation<void, Error, number, { prev: SnapShot[] }>({
    mutationFn: (feedId) => deleteFeed(feedId),

    onMutate: async (feedId) => {
      await qc.cancelQueries({ queryKey: ['feeds'] });

      const prev = qc.getQueriesData<ListCache>({ queryKey: ['feed'] }); // ['feed', sort] 전부
      prev.forEach(([key]) => {
        qc.setQueryData<ListCache>(key, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              content: p.content.filter((it) => it.feed.id !== feedId),
            })),
          };
        });
      });

      qc.removeQueries({ queryKey: ['comments', feedId], exact: true });

      return { prev };
    },

    onError: (_e, feedId, ctx) => {
      ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      qc.invalidateQueries({ queryKey: ['comments', feedId] });
    },

    // 🔁 서버와 최종 동기화
    onSettled: (_d, _e, feedId) => {
      qc.invalidateQueries({ queryKey: ['feeds'] });
      qc.invalidateQueries({ queryKey: ['comments', feedId] });
    },
  });
}
