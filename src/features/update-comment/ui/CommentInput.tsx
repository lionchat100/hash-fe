'use client';
import { useState } from 'react';
import { usePostComment } from '../model/commentPost';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ChevronUp, LoaderCircle } from 'lucide-react';

type Props = {
  feedId: number;
  disabled?: boolean;
  onPosted?: () => void;
};

export const CommentInput = ({ feedId, disabled, onPosted }: Props) => {
  const [comment, setComment] = useState('');
  const post = usePostComment(feedId);

  const onSend = () => {
    const trimmed = comment.trim();
    if (!trimmed || !feedId || post.isPending) return;

    post.mutate(trimmed, {
      onSuccess: () => {
        setComment('');
        onPosted?.();
      },
    });
  };

  return (
    <div className="flex items-center gap-6.5">
      <Input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="메시지를 입력해주세요."
        disabled={disabled || post.isPending}
        className="focus:ring-primary rounded-full border-none bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:opacity-100"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        type="button"
        disabled={disabled || post.isPending}
        onClick={onSend}
        className="hover:bg-primary/90 h-10 w-10 rounded-full bg-stone-300 text-stone-500 disabled:opacity-100"
      >
        {post.isPending ? (
          <LoaderCircle className="size-6 animate-spin" color="black" />
        ) : (
          <ChevronUp className="size-6" color="black" />
        )}
      </Button>
    </div>
  );
};
