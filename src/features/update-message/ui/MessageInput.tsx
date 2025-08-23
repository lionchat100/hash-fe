'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSendMessage } from '@/features/update-message';
import { ChevronUp, LoaderCircle } from 'lucide-react';
import { useMessageStore } from '@/entities/message';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export const MessageInput = ({ roomId }: { roomId: number }) => {
  const { sendMessage, isSending, error, resetError, canSend } = useSendMessage(roomId);
  const { messageDrafts, setMessageDraft, clearMessageDraft } = useMessageStore();
  const initialDraft = useMemo(() => messageDrafts[roomId] ?? '', [messageDrafts, roomId]);

  const [message, setMessage] = useState(initialDraft);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessage(initialDraft);
  }, [initialDraft]);

  const onChange = useCallback(
    (v: string) => {
      setMessage(v);
      setMessageDraft(roomId, v);
    },
    [roomId, setMessageDraft],
  );

  const handleSendMessage = useCallback(async () => {
    if (isSending) return;
    const ok = await sendMessage(message);
    if (ok) {
      setMessage('');
      clearMessageDraft(roomId);
      inputRef.current?.focus();
    }
  }, [isSending, sendMessage, message, roomId, clearMessageDraft]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isComposing = (e.nativeEvent as any).isComposing;
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();
        void handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => resetError(), 3000);
    return () => clearTimeout(timer);
  }, [error, resetError]);

  const disableSend = !canSend || !message || isSending;

  return (
    <div className="footer-abs-center w-full bg-white px-4 py-2">
      {error && <div className="text-error rounded-md px-3 py-2 text-xs">{error}</div>}

      <div className="flex items-center gap-7">
        <Input
          ref={inputRef}
          type="text"
          size={255}
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력해주세요"
          disabled={isSending}
          className="rounded-full border-none bg-stone-300 px-4 py-5 text-sm placeholder:text-sm placeholder:text-stone-500 focus-visible:ring-0"
        />
        <Button
          type="button"
          onClick={handleSendMessage}
          disabled={disableSend}
          aria-label="메시지 전송"
          className={cn('size-10 rounded-full bg-stone-300', canSend && 'bg-stone-900 text-stone-100')}
        >
          {isSending ? (
            <LoaderCircle className="size-6 animate-spin" color="black" />
          ) : (
            <ChevronUp className="size-6 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};
