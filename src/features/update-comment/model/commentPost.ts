import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../api/update-comment';
import { CommentItem, CommentRes, PageParam } from '@/entities/comment/model/types';
import { useUserStore } from '@/entities/user';

export function usePostComment(feedId: number) {
  const qc = useQueryClient();
  const { currentUser } = useUserStore();
  type Cache = InfiniteData<CommentRes, PageParam>;
  const commentKey = (feedId: number) => ['comments', feedId] as const;

  return useMutation({
    mutationFn: (content: string) => postComment(feedId, { content }),

    onMutate: async (content) => {
      await qc.cancelQueries({ queryKey: commentKey(feedId) });
      const prev = qc.getQueryData<Cache>(commentKey(feedId));

      const optimistic: CommentItem = {
        id: Date.now(), // 임시 ID
        feedId,
        content: content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        isLiked: false,
        writer: { id: -1, nickname: currentUser?.name ?? '', imageUrl: currentUser?.imageUrl ?? '' },
      };

      // 맨 마지막 삽입
      qc.setQueryData<Cache>(commentKey(feedId), (old) => {
        if (!old) return old;

        const first = old.pages[0];
        const injectedFirst: CommentRes = {
          ...first,
          content: [...first.content, optimistic],
        };

        return {
          ...old,
          pages: [injectedFirst, ...old.pages.slice(1)],
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        // 롤백
        qc.setQueryData(commentKey(feedId), ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: commentKey(feedId) });
    },
  });
}
