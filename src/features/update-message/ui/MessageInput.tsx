'use client';

import { useState, useRef, useEffect } from 'react';
import { useSendMessage } from '@/features/update-message';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  roomId: number;
  className?: string;
}

export const MessageInput = ({ roomId, className }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isSending, error, canSend, resetError } = useSendMessage(roomId);

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!canSend(message)) return;

    await sendMessage(message);
    setMessage('');
    inputRef.current?.focus();
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 에러가 있으면 3초 후 자동으로 사라지게
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  return (
    <div className={`bg-background border-t p-4 ${className}`}>
      {/* 에러 메시지 */}
      {error && <div className="bg-destructive/10 text-destructive mb-2 rounded-md px-3 py-2 text-sm">{error}</div>}

      {/* 입력 영역 */}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isSending}
          className="focus:ring-primary rounded-full bg-red-50 px-4 py-4 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!canSend(message) || isSending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full disabled:opacity-50"
        >
          {isSending ? '전송 중...' : <Send className="size-6" />}
        </Button>
      </div>
    </div>
  );
};
