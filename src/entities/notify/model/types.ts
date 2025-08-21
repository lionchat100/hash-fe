import { PageResponse } from '@/shared/model/types';

export type NotificationType = 'CHATROOM' | 'COMMENT' | 'POST_LIKE' | 'PROFILE_LIKE';

export interface NotificationItem {
  id: number;
  senderId: number;
  senderNickName: string;
  receiverId: number;
  receiverNickName: string;
  notificationType: NotificationType;
  createdAt: string;
  imageUrl: string;
  targetId: number;
  // notificationType에 따라 채팅방id, 피드id, 상대프로필 id
}

export type NotificationRes = PageResponse<NotificationItem>;

export interface Cursor {
  size: number;
  lastId?: number;
}

export interface NotificationCardMapData {
  href: string;
  imageUrl: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface NotificationCardData extends NotificationCardMapData {
  id: number;
  nickname: string;
}
