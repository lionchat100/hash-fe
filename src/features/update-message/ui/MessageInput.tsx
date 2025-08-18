'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSendMessage } from '@/features/update-message';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ChevronUp, LoaderCircle } from 'lucide-react';
import { useMessageStore } from '@/entities/message';

interface MessageInputProps {
  roomId: number;
  className?: string;
}

export const MessageInput = ({ roomId, className }: MessageInputProps) => {
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

  // 메시지 전송 처리
  const handleSendMessage = useCallback(async () => {
    if (isSending) return;
    const ok = await sendMessage(message);
    if (ok) {
      setMessage('');
      clearMessageDraft(roomId);
      inputRef.current?.focus();
    }
  }, [isSending, sendMessage, message, roomId, clearMessageDraft]);

  // Enter 키 처리 (IME/Shift + Enter 방지)
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

  // 에러 자동 해제
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => resetError(), 3000);
    return () => clearTimeout(timer);
  }, [error, resetError]);

  const disableSend = !canSend || !message.trim() || isSending;

  return (
    <div className={`bg-white px-4 py-2 drop-shadow-xl/20 ${className}`}>
      {/* 에러 메시지 */}
      {error && <div className="bg-destructive/10 text-destructive mb-2 rounded-md px-3 py-2 text-sm">{error}</div>}

      {/* 입력 영역 */}
      <div className="flex items-center gap-7">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력해주세요."
          disabled={isSending}
          className="focus:ring-primary rounded-full border-none bg-red-50 px-8 py-3 text-sm focus:ring-2 focus:outline-none disabled:opacity-100"
        />
        <Button
          type="button"
          onClick={handleSendMessage}
          disabled={disableSend}
          aria-label="메시지 전송"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 rounded-full disabled:opacity-100"
        >
          {isSending ? (
            <LoaderCircle className="size-6 animate-spin" color="black" />
          ) : (
            <ChevronUp className="size-6" color="black" />
          )}
        </Button>
      </div>
    </div>
  );
};
