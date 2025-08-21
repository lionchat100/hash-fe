import api from '@/shared/api/axios';
import { Cursor, NotificationRes } from '../model/types';
import { PAGE_SIZE } from '@/shared/constants/constant';

export const getNotificationList = async (cursor?: Cursor) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = { size: PAGE_SIZE };

  if (cursor?.lastId) params.lastId = cursor.lastId;
  const response = await api.get<NotificationRes>('/notifications', { params });
  return response.data;
};
