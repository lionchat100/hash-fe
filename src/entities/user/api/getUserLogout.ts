import api from '@/shared/api/axios';

export const getUserLogout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
