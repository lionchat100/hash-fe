import api from '@/shared/api/axios';

export const initChatRoom = async (receiverId: number): Promise<number> => {
  const response = await api.post<{ chatRoomId: number }>('/chatrooms/init', {
    receiverId,
  });
  return response.data.chatRoomId;
};
