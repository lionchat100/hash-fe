import { useCallback, useState } from 'react';
import { useStomp } from '@/shared/api/stomp';
import { useMessageStore } from '@/entities/message';
import { useUserStore } from '@/entities/user';
import { MessageReq, MessageRes } from '@/entities/message';

export const useSendMessage = (roomId: number) => {
  const { client } = useStomp();
  const { currentUser } = useUserStore();
  const { addMessage } = useMessageStore();

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 메시지 전송
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        setError('메시지 내용을 입력해주세요.');
        return;
      }

      if (!currentUser) {
        setError('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      try {
        setIsSending(true);
        setError(null);

        // 메시지 객체 생성
        const messageData: MessageReq = {
          chatRoomId: roomId,
          content: content.trim(),
        };

        console.log(`메시지 전송 시작:`, messageData);

        // STOMP를 통해 메시지 전송
        if (client && client.connected) {
          client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(messageData),
            headers: {
              'content-type': 'application/json',
            },
          });
        } else {
          throw new Error('STOMP 클라이언트가 연결되지 않았습니다.');
        }

        // 로컬에 즉시 메시지 추가 (낙관적 업데이트)
        const optimisticMessage: MessageRes = {
          messageId: `temp-${Date.now()}`, // 임시 ID
          chatRoomId: roomId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          imageUrl: currentUser.imageUrl,
          createdAt: new Date().toISOString(),
          content: content.trim(),
          isEnd: false,
        };

        addMessage(roomId, optimisticMessage);
        console.log('메시지 전송 완료 (낙관적 업데이트)');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '메시지 전송 중 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('메시지 전송 실패:', err);
      } finally {
        setIsSending(false);
      }
    },
    [roomId, client, currentUser, addMessage],
  );

  // 메시지 전송 상태 리셋
  const resetSendState = useCallback(() => {
    setIsSending(false);
    setError(null);
  }, []);

  // 에러 리셋
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 메시지 전송 가능 여부 확인
  const canSendMessage = useCallback(
    (content: string) => {
      return !!client && client.connected && !!currentUser && content.trim().length > 0 && !isSending;
    },
    [client, currentUser, isSending],
  );

  return {
    isSending, // 메시지 전송 상태
    error, // 에러 메시지
    canSend: canSendMessage, // 메시지 전송 가능 여부

    sendMessage, // 메시지 전송
    resetSendState, // 메시지 전송 상태 리셋
    resetError, // 에러 리셋

    currentUser, // 현재 사용자
  };
};
