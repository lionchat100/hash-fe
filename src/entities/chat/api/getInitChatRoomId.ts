import api from '@/shared/api/axios';

export const getInitChatRoomId = async (receiverId: number) => {
  const response = await api.post<{ chatRoomId: number }>(`/chatrooms/init`, {
    receiverId,
  });
  return response.data;
};
