import api from '@/shared/api/axios';
import { MessageList } from '../model/types';

export const getMoreMessageList = async (roomId: number, lastId: string | null) => {
  const response = await api.get<MessageList>(`/chatrooms/chats/messages?roomId=${roomId}&lastId=${lastId}`);
  return response.data;
};
