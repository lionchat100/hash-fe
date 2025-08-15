'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble, groupMessages } from '@/features/update-message';
import { useLoadMessage } from '@/features/update-message';
import { ScrollArea } from '@/shared/ui/ScrollArea';

interface MessageScrollAreaProps {
  roomId: number;
  className?: string;
}

export const MessageScrollArea = ({ roomId, className }: MessageScrollAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isLoadingMore, hasMore, error, loadMoreMessages } = useLoadMessage(roomId);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // 스크롤 이벤트 처리 (무한 스크롤)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (messages.length > 0 && isLoading) {
      scrollToBottom();
    }
  }, [messages.length, isLoading]);

  // 새 메시지가 추가되면 자동으로 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }, [messages.length]);

  // 그룹화된 메시지 생성
  const groupedMessages = groupMessages(messages);

  if (isLoading) {
    return (
      <div className={`flex flex-1 items-center justify-center ${className}`}>
        <div className="text-muted-foreground">메시지를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-1 items-center justify-center ${className}`}>
        <div className="text-destructive text-center">
          <div>메시지 로드 중 오류가 발생했습니다.</div>
          <div className="mt-1 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-hidden ${className}`}>
      <ScrollArea className="h-full" onScroll={handleScroll}>
        <div ref={scrollRef} className="py-4">
          {/* 추가 메시지 로딩 표시 */}
          {isLoadingMore && (
            <div className="flex justify-center py-2">
              <div className="text-muted-foreground text-sm">이전 메시지를 불러오는 중...</div>
            </div>
          )}

          {/* 메시지 목록 */}
          {groupedMessages.map((groupedMessage) => (
            <MessageBubble
              key={groupedMessage.message.messageId}
              message={groupedMessage.message}
              showAvatar={groupedMessage.showAvatar}
              showName={groupedMessage.showName}
              showTime={groupedMessage.showTime}
              isGrouped={groupedMessage.isGrouped}
            />
          ))}

          {/* 메시지가 없을 때 */}
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground text-center">
                <div>아직 메시지가 없습니다.</div>
                <div className="mt-1 text-sm">첫 번째 메시지를 보내보세요!</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
