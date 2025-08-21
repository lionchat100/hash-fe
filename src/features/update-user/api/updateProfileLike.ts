import api from '@/shared/api/axios';

export const likeProfile = async ({ userId }: { userId: number }) => {
  const response = await api.post(`/users/likes/${userId}`);
  return response.data;
};

export const unlikeProfile = async ({ userId }: { userId: number }) => {
  const response = await api.post(`/users/likes/${userId}`);
  return response.data;
};
