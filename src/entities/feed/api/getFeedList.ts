import api from '@/shared/api/axios';
import { FeedRes, Sort } from '../model/types';
import { PAGE_SIZE } from '@/shared/constants/constant';

export const getFeedList = async ({ pageParam, sort }: { pageParam?: number | null; sort: Sort }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = { size: PAGE_SIZE };
  const PATH: Record<Sort, string> = {
    latest: '/feeds',
    popular: '/feeds/hot',
  };
  if (pageParam) params.lastId = pageParam;

  const response = await api.get<FeedRes>(PATH[sort], { params });
  return response.data;
};
