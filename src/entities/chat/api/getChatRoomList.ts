import api from '@/shared/api/axios';
import { ChatRoomList } from '../model/types';

export const getChatRoomList = async () => {
  const response = await api.get<ChatRoomList>('/chatrooms');
  return response.data;
};
