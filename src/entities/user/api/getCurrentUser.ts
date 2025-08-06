import api from '@/shared/api/axios';
import { User } from '../model/types';

export const getCurrentUser = async () => {
  const response = await api.get<User>('/users/me');
  return response.data;
};
