import api from '@/shared/api/axios';

export const getAccessToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};
