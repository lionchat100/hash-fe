import { formatChatTime } from '@/shared/lib/dateUtils';
import type { NotificationItem, NotificationCardMapData } from '../model/types';

export const typeToCardData = (n: NotificationItem): NotificationCardMapData => {
  switch (n.notificationType) {
    case 'CHATROOM':
      return {
        title: '채팅방이 생성되었어요!',
        body: '새로운 대화가 얼렸어요! 지금 시작해볼까요?',
        href: `/chats/${n.targetId}`,
        imageUrl: n.imageUrl,
        createdAt: formatChatTime(n.createdAt),
      };
    case 'COMMENT':
      return {
        title: '게시글에 댓글이 달렸어요',
        body: '누군가 당신의 생각에 답했어요. 지금 확인해보세요.',
        href: `/feed?tab=my`,
        imageUrl: n.imageUrl,
        createdAt: formatChatTime(n.createdAt),
      };
    case 'POST_LIKE':
      return {
        title: '게시글에 좋아요♥가 달렸어요',
        body: '누군가 당신의 생각에 반응했어요. 확인해 보세요!',
        href: `/feed?tab=my`,
        imageUrl: n.imageUrl,
        createdAt: formatChatTime(n.createdAt),
      };
    case 'PROFILE_LIKE':
      return {
        title: `${n.senderNickName}님이 좋아요♥를 보냈어요!`,
        body: '누군가에게 관심을 받으셨어요! 확인해볼까요?',
        href: `/profile/${n.targetId}`,
        imageUrl: n.imageUrl,
        createdAt: formatChatTime(n.createdAt),
      };
    default:
      return {
        title: '알림',
        body: '알림이 도착했어요.',
        href: '/notify',
        imageUrl: n.imageUrl,
        createdAt: formatChatTime(n.createdAt),
      };
  }
};
