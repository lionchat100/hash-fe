import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../api/postComment';
import { CommentItem, CommentRes, PageParam } from '@/entities/comment/model/types';
import { useUserStore } from '@/entities/user';
import { rateLimiter } from '../libs/rateLimiter';
import { toast } from 'sonner';

export function usePostComment(feedId: number, opts?: { onSuccess?: (data: unknown, content: string) => void }) {
  const qc = useQueryClient();
  const { currentUser } = useUserStore();
  type Cache = InfiniteData<CommentRes, PageParam>;
  const commentKey = (feedId: number) => ['comments', feedId] as const;

  return useMutation({
    mutationFn: async (content: string) => {
      if (!rateLimiter.canSend(feedId)) throw new Error('RATE_LIMITED');

      rateLimiter.record(feedId);
      return postComment(feedId, { content });
    },

    onSuccess: (data, content) => {
      opts?.onSuccess?.(data, content);
      const prev = qc.getQueryData<Cache>(commentKey(feedId));
      if (!prev) return;

      const optimistic: CommentItem = {
        id: Date.now(), // 임시 ID
        feedId,
        content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        isLiked: false,
        writer: { id: -1, nickname: currentUser?.name ?? '', imageUrl: currentUser?.imageUrl ?? '' },
      };

      const first = prev.pages[0];
      const injectedFirst: CommentRes = { ...first, content: [...first.content, optimistic] };

      qc.setQueryData<Cache>(commentKey(feedId), {
        ...prev,
        pages: [injectedFirst, ...prev.pages.slice(1)],
      });
    },
    onError: (err) => {
      if ((err as Error)?.message === 'RATE_LIMITED') {
        toast.error('중복 등록을 방지하기 위해\n잠시 후에 다시 댓글 작성이 가능해요');
        return;
      }
      toast.error('댓글 작성에 실패했어요.');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: commentKey(feedId) });
    },
  });
}
