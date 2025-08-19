'use client';
import { useState } from 'react';
import { usePostComment } from '../model/commentPost';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

export const CommentInput = ({ feedId, disabled }: { feedId: number | null; disabled?: boolean }) => {
  const [val, setVal] = useState('');
  const mutation = usePostComment(feedId ?? 0);

  const onSend = () => {
    const trimmed = val.trim();
    if (!trimmed || !feedId || mutation.isPending) return;

    mutation.mutate(trimmed, {
      onSuccess: () => setVal(''),
    });
  };

  return (
    <div className="flex gap-2">
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="댓글을 입력하세요"
        disabled={disabled || mutation.isPending}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button disabled={disabled || mutation.isPending} onClick={onSend}>
        보내기
      </Button>
    </div>
  );
};
