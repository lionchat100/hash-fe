'use client';

import { useEffect } from 'react';
import { useChatSubscription } from '@/features/update-chat';
import { MessageScrollArea } from '@/widgets/message';
import { MessageInput } from '@/features/update-message';
import { useChatStore } from '@/entities/chat';
import { MessageHeader } from '@/entities/message';

export const ChatRoomView = ({
  roomId,
  opponentNickname,
  currentUserId,
  opponentUserId,
}: {
  roomId: number;
  opponentNickname: string;
  currentUserId: number;
  opponentUserId: number;
}) => {
  const { setCurrentRoom } = useChatStore();

  useEffect(() => {
    setCurrentRoom(roomId);
    return () => setCurrentRoom(null);
  }, [roomId, setCurrentRoom]);

  useChatSubscription(roomId);

  return (
    <div className="relative flex h-dvh flex-col">
      {/* 채팅방 헤더 */}
      <MessageHeader opponentNickname={opponentNickname} opponentUserId={opponentUserId} />

      {/* 메시지 스크롤 영역 */}
      <MessageScrollArea roomId={roomId} currentUserId={currentUserId} />

      {/* 메시지 입력 영역 */}
      <MessageInput roomId={roomId} />
    </div>
  );
};
