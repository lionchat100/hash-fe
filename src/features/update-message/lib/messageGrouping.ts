import { MessageRes } from '@/entities/message';

export interface GroupedMessage {
  message: MessageRes;
  showAvatar: boolean;
  showName: boolean;
  showTime: boolean;
  isGrouped: boolean;
}

// 메시지들을 그룹화하는 함수
export const groupMessages = (messages: MessageRes[]): GroupedMessage[] => {
  if (messages.length === 0) return [];

  const grouped: GroupedMessage[] = [];
  const timeThreshold = 5 * 60 * 1000; // 5분

  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];
    const prevMessage = i > 0 ? messages[i - 1] : null;

    // 이전 메시지와 비교하여 그룹화 여부 결정
    const isSameSender = prevMessage?.senderId === currentMessage.senderId;
    const isWithinTimeThreshold = prevMessage
      ? Math.abs(new Date(currentMessage.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) <
        timeThreshold
      : false;

    const isGrouped = isSameSender && isWithinTimeThreshold;

    // 아바타 표시: 그룹의 첫 번째 메시지이거나 다른 발신자
    const showAvatar = !isGrouped;

    // 이름 표시: 그룹의 첫 번째 메시지이거나 다른 발신자
    const showName = !isGrouped;

    // 시간 표시: 그룹의 마지막 메시지이거나 다음 메시지가 다른 발신자/시간대
    const nextMessage = i < messages.length - 1 ? messages[i + 1] : null;
    const isLastInGroup =
      !nextMessage ||
      nextMessage.senderId !== currentMessage.senderId ||
      Math.abs(new Date(nextMessage.createdAt).getTime() - new Date(currentMessage.createdAt).getTime()) >=
        timeThreshold;

    const showTime = isLastInGroup;

    grouped.push({
      message: currentMessage,
      showAvatar,
      showName,
      showTime,
      isGrouped,
    });
  }

  return grouped;
};
