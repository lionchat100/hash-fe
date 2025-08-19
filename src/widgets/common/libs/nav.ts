import { House, MessageCircleMore, CircleUserRound, SquareChartGantt } from 'lucide-react';

export const navItems = [
  { key: 'explore', Icon: House, label: '홈' },
  { key: 'chats', Icon: MessageCircleMore, label: '채팅' },
  { key: 'feed', Icon: SquareChartGantt, label: '게시판' },
  { key: 'profile', Icon: CircleUserRound, label: '프로필' },
] as const;
