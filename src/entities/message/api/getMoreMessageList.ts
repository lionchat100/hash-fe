import api from '@/shared/api/axios';
import { LoadMessageList } from '../model/types';

export const getMoreMessageList = async (roomId: number, lastId: number) => {
  const response = await api.get<LoadMessageList>(`/chatrooms/chats/messages?roomId=${roomId}&lastId=${lastId}`);
  return response.data;
};
