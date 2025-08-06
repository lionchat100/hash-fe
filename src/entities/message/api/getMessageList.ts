import api from '@/shared/api/axios';
import { MessageList } from '../model/types';

export const getMessageList = async (roomId: number) => {
  const response = await api.get<MessageList>(`/chatmessages/${roomId}`);
  return response.data;
};
