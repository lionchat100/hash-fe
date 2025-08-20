import api from '@/shared/api/axios';

export const deleteFeed = async (feedId: number) => {
  const response = await api.delete(`/feeds/${feedId}`);
  return response.data;
};
