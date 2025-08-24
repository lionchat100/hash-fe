import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/deleteComment';
import { CommentRes, PageParam } from '@/entities/comment/model/types';

export function useDeleteComment(feedId: number) {
  const qc = useQueryClient();

  type Cache = InfiniteData<CommentRes, PageParam>;
  const commentKey = (feedId: number) => ['comments', feedId] as const;

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: commentKey(feedId) });

      const prev = qc.getQueryData<Cache>(commentKey(feedId));

      // 댓글 목록에서 제거
      qc.setQueryData<Cache>(commentKey(feedId), (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.filter((c) => c.id !== commentId),
          })),
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
