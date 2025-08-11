import api from '@/shared/api/axios';
import { LoadMessageList } from '../model/types';

export const getMessageList = async (roomId: number) => {
  const response = await api.get<LoadMessageList>(`/chatrooms/chats/messages?roomId=${roomId}`);
  return response.data;
};
