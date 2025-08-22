import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { initChatRoom } from '../api/initChatRoom';

export const useChatStartOnExplore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const startChat = async (targetUserId: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const chatRoomId = await initChatRoom(targetUserId);
      router.push(`/chats/${chatRoomId}`);
      console.log(`채팅방 생성 및 이동 완료: ${chatRoomId}`);
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startChat,
    isLoading,
  };
};
