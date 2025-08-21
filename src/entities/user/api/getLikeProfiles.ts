import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

export const getLikeProfiles = async () => {
  const response = await api.get<UserProfile[]>('/users/likes/lists');
  return response.data;
};
