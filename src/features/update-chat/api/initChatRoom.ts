import api from '@/shared/api/axios';

export const initChatRoom = async (id: number): Promise<number> => {
  const response = await api.post<{ chatRoomId: number }>('/chatrooms/init', {
    id,
  });
  return response.data.chatRoomId;
};
