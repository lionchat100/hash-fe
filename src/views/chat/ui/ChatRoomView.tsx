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
    <div className="relative h-dvh">
      <MessageHeader opponentNickname={opponentNickname} opponentUserId={opponentUserId} />

      <MessageScrollArea roomId={roomId} currentUserId={currentUserId} />

      <MessageInput roomId={roomId} />
    </div>
  );
};
