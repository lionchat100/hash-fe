import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 채팅에서 사용할 시간 표시 (오전/오후 h:mm 형식)
export const formatChatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'a h:mm', { locale: ko });
};

// 작성 시간 표시 (00분 전 형식)
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const created = new Date(dateString);

  const diffMs = now.getTime() - created.getTime(); // 밀리초 차이
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // 이 부분은 기획 확인 필요
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return '어제';
  if (diffDay < 7) return `${diffDay}일 전`;

  // 일주일 이상이면 날짜로 표시
  return created.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
