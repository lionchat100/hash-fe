import { useCallback, useMemo, useState } from 'react';
import { useStomp } from '@/shared/api/stomp';
import { useUserStore } from '@/entities/user';
import { useMessageStore } from '@/entities/message';
import { useChatStore } from '@/entities/chat';
import { buildMessagePayload } from '@/features/update-message';

export const useSendMessage = (roomId: number) => {
  const { client, isConnected } = useStomp();
  const { currentUser } = useUserStore();
  const { currentRoomId } = useChatStore();
  const { clearMessageDraft } = useMessageStore();

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActiveRoom = useMemo(() => currentRoomId === roomId, [currentRoomId, roomId]);

  const canSend = useMemo(() => {
    return !!client && isConnected && !!currentUser && !isSending && isActiveRoom;
  }, [client, isConnected, currentUser, isSending, isActiveRoom]);

  // 메시지 전송
  const sendMessage = useCallback(
    async (raw: string): Promise<boolean> => {
      const built = buildMessagePayload(roomId, raw);
      if (!built.ok) {
        setError(built.error);
        return false;
      }
      if (!currentUser) {
        setError('사용자 정보 찾을 수 없음');
        return false;
      }
      if (!client || !isConnected) {
        setError('연결이 끊어졌습니다.');
        return false;
      }
      if (!isActiveRoom) {
        setError('현재 활성화된 채팅방이 아닙니다.');
        return false;
      }

      try {
        setIsSending(true);
        setError(null);
        client.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(built.value),
          headers: { 'content-type': 'application/json' },
        });
        clearMessageDraft(roomId);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : '메시지 전송 중 오류 발생';
        setError(message);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [client, isConnected, currentUser, isActiveRoom, roomId, clearMessageDraft],
  );

  return {
    isSending,
    error,
    canSend, // 버튼 비활성화용
    sendMessage,
    resetError: () => setError(null),
  };
};
