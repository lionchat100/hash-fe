import api from '@/shared/api/axios';
import { CommentRes, PageParam } from '../model/types';

export const getCommentList = async (feedId: number, pageParam: PageParam) => {
  const { size = 20, lastId } = pageParam ?? {};
  const params = {
    size,
    ...(lastId != null ? { lastId } : {}),
  };

  const response = await api.get<CommentRes>(`/feeds/${feedId}/comments`, { params });
  return response.data;
};
