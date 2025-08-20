import api from '@/shared/api/axios';
import { Cursor, FeedRes, Sort } from '../model/types';
import { buildParams } from '../libs/buildParams';

export const getFeedList = async (sort: Sort, cursor?: Cursor) => {
  const PATH: Record<Sort, string> = {
    latest: '/feeds',
    popular: '/feeds/hot',
    my: '/feeds/me',
  };

  const params = buildParams(sort, cursor);

  const response = await api.get<FeedRes>(PATH[sort], { params });
  return response.data;
};
