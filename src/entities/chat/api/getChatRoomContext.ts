import api from '@/shared/api/axios';
import { ChatRoomContext } from '../model/types';

export const getChatRoomContext = async (roomId: number): Promise<ChatRoomContext> => {
  const response = await api.get(`/chatrooms/context?roomId=${roomId}`);
  return response.data;
};
