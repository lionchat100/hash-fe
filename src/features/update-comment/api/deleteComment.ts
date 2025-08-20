import api from '@/shared/api/axios';

export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/feeds/comments/${commentId}`);
  return response.data;
};
