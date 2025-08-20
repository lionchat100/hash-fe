'use client';
import { useRef, useState } from 'react';
import { usePostComment } from '../model/commentPost';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ChevronUp, LoaderCircle } from 'lucide-react';
import { rateLimiter } from '../libs/rateLimiter';
import { toast } from 'sonner';

type Props = {
  feedId: number;
  disabled?: boolean;
  onPosted?: () => void;
};

export const CommentInput = ({ feedId, disabled, onPosted }: Props) => {
  const [comment, setComment] = useState('');
  const sendingRef = useRef(false);
  const post = usePostComment(feedId, {
    onSuccess: () => {
      setComment('');
      onPosted?.();
    },
  });

  const onSend = () => {
    const trimmed = comment.trim();
    if (!trimmed || !feedId || post.isPending || sendingRef.current) return;

    console.log('canSend?', rateLimiter.canSend(feedId));

    if (!rateLimiter.canSend(feedId)) {
      toast.error(`중복 등록을 방지하기 위해\n잠시 후에 다시 댓글 작성이 가능해요`);
      return;
    }
    console.log('CommentInput onSend', trimmed);

    sendingRef.current = true;

    post.mutate(trimmed, {
      onSettled: () => {
        sendingRef.current = false;
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSend();
      }}
    >
      <div className="flex items-center gap-6.5">
        <Input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="메시지를 입력해주세요."
          disabled={disabled || post.isPending}
          className="focus:ring-primary rounded-full border-none bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:opacity-100"
          onKeyDown={(e) => {
            // IME 조합/키 반복 방지
            // @ts-expect-error: nativeEvent exists
            if (e.isComposing || e.nativeEvent?.isComposing) return;
            if (e.repeat) return;

            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
              onSend();
            }
          }}
        />
        <Button
          type="button"
          disabled={disabled || post.isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSend();
          }}
          className="hover:bg-primary/90 h-10 w-10 rounded-full bg-stone-300 text-stone-500 disabled:opacity-100"
        >
          {post.isPending ? (
            <LoaderCircle className="size-6 animate-spin" color="black" />
          ) : (
            <ChevronUp className="size-6" color="black" />
          )}
        </Button>
      </div>
    </form>
  );
};
