import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 채팅에서 사용할 시간 표시 (오전/오후 h:mm 형식)
export const formatChatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'a h:mm', { locale: ko });
};
