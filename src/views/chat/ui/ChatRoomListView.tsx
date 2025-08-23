'use client';

import { ChatRoomListHeader } from '@/entities/chat';
import { ChatRoomList } from '@/widgets/chat';
import { useChatStore } from '@/entities/chat';
import { useEffect } from 'react';

export const ChatRoomListView = () => {
  const { clearChat } = useChatStore();

  useEffect(() => {
    clearChat();
  }, [clearChat]);

  return (
    <div className="relative h-dvh">
      <ChatRoomListHeader />
      <ChatRoomList />
    </div>
  );
};
