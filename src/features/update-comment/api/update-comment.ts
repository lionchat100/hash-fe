import { CommentReq } from '@/entities/comment/model/types';
import api from '@/shared/api/axios';

export const postComment = async (feedId: number, body: CommentReq) => {
  const response = await api.post<{ id: number }>(`/feeds/${feedId}/comments`, body);
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/feeds/comments/${commentId}`);
  return response.data;
};
