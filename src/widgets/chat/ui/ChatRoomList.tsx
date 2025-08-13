'use client';

import { useEffect, useState } from 'react';
import { ChatRoom } from '@/entities/chat';
import { ChatRoomItem } from '@/entities/chat';
import { getChatRoomList } from '@/entities/chat/api/getChatRoomList';
import { ScrollArea } from '@/shared/ui/ScrollArea';

export const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getChatRoomList();
        setChatRooms(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '채팅방 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">채팅방 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">채팅방이 없습니다.</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-54px)] pb-[56px]">
      {chatRooms.map((chatRoom) => (
        <ChatRoomItem key={chatRoom.chatRoomId} chatRoom={chatRoom} />
      ))}
    </ScrollArea>
  );
};
