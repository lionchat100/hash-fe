'use client';

import { useEffect, useState } from 'react';
import { ChatRoom } from '@/entities/chat';
import { ChatRoomItem } from '@/entities/chat';
import { getChatRoomList } from '@/entities/chat/api/getChatRoomList';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

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
    return <FallbackScreen text={`채팅방 목록을 불러오는 중...`} fullScreen image="heart" />;
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
      <FallbackScreen
        type="hold"
        text={`고민만 하지말고,\n커피챗 해보세요!`}
        className="h-[calc(100svh-54px)]"
        image="heart"
        hasButtonLink="/explore"
        buttonText="프로필 둘러보기"
      />
    );
  }

  return (
    <div className="scrollbar-hide h-dvh overflow-y-auto">
      <div className="pt-[54px] pb-[56px]">
        {chatRooms.map((chatRoom) => (
          <ChatRoomItem key={chatRoom.chatRoomId} chatRoom={chatRoom} />
        ))}
      </div>
    </div>
  );
};
