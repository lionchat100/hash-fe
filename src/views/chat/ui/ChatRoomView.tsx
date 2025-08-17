'use client';

import { useEffect } from 'react';
import { useChatSubscription } from '@/features/update-chat';
import { MessageScrollArea } from '@/widgets/message';
import { MessageInput } from '@/features/update-message';
import { useChatStore } from '@/entities/chat';
import { MessageHeader } from '@/entities/message';

export const ChatRoomView = ({ roomId }: { roomId: number }) => {
  const { setCurrentRoom, setPersonName, personName } = useChatStore();

  useEffect(() => {
    setCurrentRoom(roomId);
    return () => {
      setCurrentRoom(null);
      setPersonName(null);
    };
  }, [roomId, setCurrentRoom]);

  useChatSubscription(roomId);

  return (
    <div className="flex h-screen flex-col">
      {/* 채팅방 헤더 */}
      <MessageHeader personName={personName} />

      {/* 메시지 스크롤 영역 */}
      <div className="min-h-0 flex-1">
        <MessageScrollArea roomId={roomId} className="h-full" />
      </div>

      {/* 메시지 입력 영역 */}
      <MessageInput roomId={roomId} />
    </div>
  );
};
