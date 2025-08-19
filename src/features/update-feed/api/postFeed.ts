import api from '@/shared/api/axios';
import { FeedReq } from '@/entities/feed/model/types';

export const postFeed = async (feedReq: FeedReq) => {
  const response = await api.post<number>('/feeds', feedReq);
  return response.data;
};
