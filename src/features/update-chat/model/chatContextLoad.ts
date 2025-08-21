import { getChatRoomContext } from '@/entities/chat/api/getChatRoomContext';
import { getCurrentUser } from '@/entities/user/api/getCurrentUser';

export interface ChatContextLoadResult {
  isValid: boolean;
  opponentNickname: string;
}

export const chatContextLoad = async (roomId: number): Promise<ChatContextLoadResult> => {
  try {
    const [currentUser, chatRoomContext] = await Promise.all([getCurrentUser(), getChatRoomContext(roomId)]);

    const isCurrentUserInRoom =
      currentUser.id === chatRoomContext.senderId || currentUser.id === chatRoomContext.receiverId;

    const opponentNickname =
      currentUser.id === chatRoomContext.senderId ? chatRoomContext.receiverNickname : chatRoomContext.senderNickname;

    return {
      isValid: isCurrentUserInRoom,
      opponentNickname,
    };
  } catch (error) {
    console.error('채팅방 컨텍스트 로드 중 에러 발생:', error);
    return {
      isValid: false,
      opponentNickname: '',
    };
  }
};
