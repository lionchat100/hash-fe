import { useCallback, useState } from 'react';
import { useStomp } from '@/shared/api/stomp';
import { useUserStore } from '@/entities/user';
import { MessageReq } from '@/entities/message';

export const useSendMessage = (roomId: number) => {
  const { client } = useStomp();
  const { currentUser } = useUserStore();
  // const { addMessage } = useMessageStore();

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
        setError('사용자 정보 찾을 수 없음');
        return;
      }
      try {
        setIsSending(true);
        setError(null);
        const messageData: MessageReq = {
          chatRoomId: roomId,
          content: content.trim(),
        };
        console.log(`메시지 전송: ${messageData}`);
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
        // const optimisticMessage: MessageRes = {
        //   messageId: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        //   chatRoomId: roomId,
        //   senderId: currentUser.id,
        //   senderName: currentUser.name,
        //   imageUrl: currentUser.imageUrl,
        //   createdAt: new Date().toISOString(),
        //   content: content.trim(),
        //   isEnd: false,
        // };
        // addMessage(roomId, optimisticMessage);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '메시지 전송 중 오류 발생';
        setError(errorMessage);
        console.error('메시지 전송 실패:', error);
      } finally {
        setIsSending(false);
      }
    },
    [roomId, client, currentUser],
  );

  // 메시지 전송 상태 초기화
  const resetSendState = useCallback(() => {
    setIsSending(false);
    setError(null);
  }, []);

  // 에러 초기화
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
    isSending,
    error,
    canSend: canSendMessage,
    sendMessage,
    resetError,
    resetSendState,
    currentUser,
  };
};
