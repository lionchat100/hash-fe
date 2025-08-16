import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

export const getUserProfile = async () => {
  const response = await api.get<UserProfile>('/users/profile');
  return response.data;
};
