import { useCallback, useState } from 'react';
import { useStomp } from '@/shared/api/stomp';
import { useUserStore } from '@/entities/user';
import { MessageAck } from '@/entities/message';

export const useAckMessage = () => {
  const { client } = useStomp();
  const { currentUser } = useUserStore();

  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acknowledgedMessages, setAcknowledgedMessages] = useState<Set<string>>(new Set());

  // 단일 메시지 읽음 확인
  const ackMessage = useCallback(
    async (messageId: string) => {
      if (!currentUser) {
        setError('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      // 이미 확인된 메시지인지 체크
      if (acknowledgedMessages.has(messageId)) {
        console.log(`메시지 ${messageId}는 이미 읽음 확인되었습니다.`);
        return;
      }

      try {
        setIsAcknowledging(true);
        setError(null);

        const ackData: MessageAck = {
          messageId,
          userId: currentUser.id,
        };

        console.log(`메시지 읽음 확인 시작:`, ackData);

        // STOMP를 통해 읽음 확인 전송
        if (client && client.connected) {
          client.publish({
            destination: '/app/message.ack',
            body: JSON.stringify(ackData),
            headers: {
              'content-type': 'application/json',
            },
          });
        } else {
          throw new Error('STOMP 클라이언트가 연결되지 않았습니다.');
        }

        // 로컬에서 읽음 확인 상태 업데이트
        setAcknowledgedMessages((prev) => new Set([...prev, messageId]));

        console.log(`메시지 ${messageId} 읽음 확인 완료`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '읽음 확인 중 오류가 발생했습니다.';
        setError(errorMessage);
        console.error(`메시지 ${messageId} 읽음 확인 실패:`, err);
      } finally {
        setIsAcknowledging(false);
      }
    },
    [client, currentUser, acknowledgedMessages],
  );

  // 여러 메시지 일괄 읽음 확인
  const ackMultipleMessages = useCallback(
    async (messageIds: string[]) => {
      if (!currentUser) {
        setError('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      if (messageIds.length === 0) return;

      try {
        setIsAcknowledging(true);
        setError(null);

        console.log(`${messageIds.length}개 메시지 일괄 읽음 확인 시작`);

        // 각 메시지에 대해 읽음 확인 전송
        if (client && client.connected) {
          const ackPromises = messageIds.map((messageId) => {
            const ackData: MessageAck = {
              messageId,
              userId: currentUser.id,
            };

            return client.publish({
              destination: '/app/message.ack',
              body: JSON.stringify(ackData),
              headers: {
                'content-type': 'application/json',
              },
            });
          });

          await Promise.all(ackPromises);
        } else {
          throw new Error('STOMP 클라이언트가 연결되지 않았습니다.');
        }

        setAcknowledgedMessages((prev) => {
          const newSet = new Set(prev);
          messageIds.forEach((id) => newSet.add(id));
          return newSet;
        });

        console.log(`${messageIds.length}개 메시지 일괄 읽음 확인 완료`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '일괄 읽음 확인 중 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('일괄 읽음 확인 실패:', err);
      } finally {
        setIsAcknowledging(false);
      }
    },
    [client, currentUser],
  );

  // 채팅방의 모든 읽지 않은 메시지 읽음 확인
  const ackAllUnreadMessages = useCallback(
    async (unreadMessageIds: string[]) => {
      if (unreadMessageIds.length === 0) {
        console.log('읽지 않은 메시지가 없습니다.');
        return;
      }
      await ackMultipleMessages(unreadMessageIds);
    },
    [ackMultipleMessages],
  );

  // 메시지 읽음 확인 상태 확인
  const isMessageAcknowledged = useCallback(
    (messageId: string) => {
      return acknowledgedMessages.has(messageId);
    },
    [acknowledgedMessages],
  );

  // 읽음 확인 상태 리셋
  const resetAckState = useCallback(() => {
    setIsAcknowledging(false);
    setError(null);
  }, []);

  // 에러 리셋
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 특정 메시지의 읽음 확인 상태 제거 (테스트용)
  const removeAckStatus = useCallback((messageId: string) => {
    setAcknowledgedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  // 모든 읽음 확인 상태 초기화
  const clearAllAckStatus = useCallback(() => {
    setAcknowledgedMessages(new Set());
  }, []);

  return {
    isAcknowledging, // 읽음 확인 상태
    error, // 에러 메시지
    acknowledgedMessages: Array.from(acknowledgedMessages), // 읽음 확인 상태 목록

    ackMessage, // 단일 메시지 읽음 확인
    ackMultipleMessages, // 여러 메시지 일괄 읽음 확인
    ackAllUnreadMessages, // 채팅방의 모든 읽지 않은 메시지 읽음 확인
    isMessageAcknowledged, // 메시지 읽음 확인 상태 확인

    resetAckState, // 읽음 확인 상태 리셋
    resetError, // 에러 리셋
    removeAckStatus, // 특정 메시지의 읽음 확인 상태 제거 (테스트용)
    clearAllAckStatus, // 모든 읽음 확인 상태 초기화

    currentUser, // 현재 사용자
    totalAcknowledged: acknowledgedMessages.size, // 읽음 확인 상태 개수
  };
};
