import { useCallback, useEffect, useState } from 'react';
import { getMessageList, getMoreMessageList, useMessageStore } from '@/entities/message';

export const useLoadMessage = (roomId: number) => {
  const {
    currentRoomMessages,
    currentRoomId,
    isLoading,
    isLoadingMore,
    hasMore,
    lastMessageId,
    setMessages,
    prependMessages,
    setCurrentRoomMessages,
    setLoading,
    setLoadingMore,
    setHasMore,
    setLastMessageId,
  } = useMessageStore();

  const [error, setError] = useState<string | null>(null);

  // 초기 메시지 로드
  const loadInitialMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      setError(null);
      const messageList = await getMessageList(roomId);
      if (messageList && Array.isArray(messageList)) {
        const roomMessages = messageList.reverse();
        setMessages(roomId, roomMessages);
        if (roomMessages.length > 0) {
          setLastMessageId(roomMessages[0].messageId);
          setHasMore(!roomMessages[0].isEnd);
        } else {
          setHasMore(false);
        }
        console.log(`채팅방 ${roomId} 초기 메시지 ${roomMessages.length}개 로드 완료`);
      } else {
        setMessages(roomId, []);
        setHasMore(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '메시지 로드 중 오류 발생';
      setError(errorMessage);
      console.error(`채팅방 ${roomId} 초기 메시지 로드 실패:`, error);
    } finally {
      setLoading(false);
    }
  }, [roomId, setMessages, setLastMessageId, setHasMore, setLoading]);

  // 추가 메시지 로드
  const loadMoreMessages = useCallback(async () => {
    if (!roomId || !hasMore || isLoadingMore || !lastMessageId) return;
    try {
      setLoadingMore(true);
      setError(null);
      const messageList = await getMoreMessageList(roomId, parseInt(lastMessageId));
      if (messageList && Array.isArray(messageList)) {
        const newMessages = messageList.reverse();
        if (newMessages.length > 0) {
          prependMessages(roomId, newMessages);
          setLastMessageId(newMessages[0].messageId);
          setHasMore(!newMessages[0].isEnd);
          console.log(`채팅방 ${roomId} 추가 메시지 ${newMessages.length}개 로드 완료`);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '추가 메시지 로드 중 오류 발생';
      setError(errorMessage);
      console.error(`채팅방 ${roomId} 추가 메시지 로드 실패:`, error);
    } finally {
      setLoadingMore(false);
    }
  }, [roomId, hasMore, isLoadingMore, lastMessageId, prependMessages, setLastMessageId, setHasMore, setLoadingMore]);

  // 새 메시지 수신 시 자동으로 currentRoomMessages 업데이트
  useEffect(() => {
    if (currentRoomId === roomId) {
      setCurrentRoomMessages(roomId);
    }
  }, [roomId, currentRoomId, setCurrentRoomMessages]);

  // 컴포넌트 마운트 시 초기 메시지 로드
  useEffect(() => {
    if (roomId) {
      loadInitialMessages();
    }
  }, [roomId, loadInitialMessages]);

  // 에러 리셋
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages: currentRoomMessages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadInitialMessages,
    loadMoreMessages,
    resetError,
  };
};
