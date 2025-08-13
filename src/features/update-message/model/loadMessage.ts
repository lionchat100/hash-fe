import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from '@/entities/message';
import { getMessageList, getMoreMessageList } from '@/entities/message';

export const useLoadMessage = (roomId: number, pageSize: number = 30) => {
  const {
    messages,
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

      console.log(`채팅방 ${roomId} 초기 메시지 로드 시작`);
      const messageList = await getMessageList(roomId);

      if (messageList && Array.isArray(messageList)) {
        const roomMessages = messageList;
        setMessages(roomId, roomMessages);
        setCurrentRoomMessages(roomId);

        // 페이지네이션 정보 설정
        if (roomMessages.length > 0) {
          setLastMessageId(roomMessages[0].messageId);
          setHasMore(roomMessages.length >= pageSize);
        } else {
          setHasMore(false);
        }

        console.log(`채팅방 ${roomId} 초기 메시지 ${roomMessages.length}개 로드 완료`);
      } else {
        setMessages(roomId, []);
        setCurrentRoomMessages(roomId);
        setHasMore(false);
        console.log(`채팅방 ${roomId}에 메시지가 없습니다.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '메시지 로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error(`채팅방 ${roomId} 초기 메시지 로드 실패:`, err);
    } finally {
      setLoading(false);
    }
  }, [roomId, pageSize, setMessages, setCurrentRoomMessages, setLastMessageId, setHasMore, setLoading]);

  // 추가 메시지 로드 (스크롤 시)
  const loadMoreMessages = useCallback(async () => {
    if (!roomId || !hasMore || isLoadingMore || !lastMessageId) return;

    try {
      setLoadingMore(true);
      setError(null);

      console.log(`채팅방 ${roomId} 추가 메시지 로드 시작 (lastId: ${lastMessageId})`);
      const messageList = await getMoreMessageList(roomId, parseInt(lastMessageId));

      if (messageList && Array.isArray(messageList)) {
        const newMessages = messageList;

        if (newMessages.length > 0) {
          // 새 메시지들을 기존 메시지 앞에 추가
          prependMessages(roomId, newMessages);

          // 현재 채팅방이면 currentRoomMessages도 업데이트
          if (currentRoomId === roomId) {
            setCurrentRoomMessages(roomId);
          }

          // 페이지네이션 정보 업데이트
          setLastMessageId(newMessages[0].messageId);
          setHasMore(newMessages.length >= pageSize);

          console.log(`채팅방 ${roomId} 추가 메시지 ${newMessages.length}개 로드 완료`);
        } else {
          setHasMore(false);
          console.log(`채팅방 ${roomId} 더 이상 불러올 메시지가 없습니다.`);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가 메시지 로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error(`채팅방 ${roomId} 추가 메시지 로드 실패:`, err);
    } finally {
      setLoadingMore(false);
    }
  }, [
    roomId,
    hasMore,
    isLoadingMore,
    lastMessageId,
    pageSize,
    currentRoomId,
    prependMessages,
    setCurrentRoomMessages,
    setLastMessageId,
    setHasMore,
    setLoadingMore,
  ]);

  // 새 메시지 수신 시 자동으로 currentRoomMessages 업데이트
  useEffect(() => {
    if (messages[roomId] && currentRoomId === roomId) {
      setCurrentRoomMessages(roomId);
    }
  }, [messages, roomId, currentRoomId, setCurrentRoomMessages]);

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
    messages: currentRoomMessages, // 현재 채팅방의 메시지 목록
    isLoading, // 메시지 로딩 상태
    isLoadingMore, // 추가 메시지 로딩 상태
    hasMore, // 더 많은 메시지가 있는지 여부
    error, // 에러 메시지

    loadInitialMessages, // 초기 메시지 로드
    loadMoreMessages, // 추가 메시지 로드
    resetError, // 에러 리셋

    totalMessageCount: currentRoomMessages.length, // 현재 채팅방의 메시지 개수
  };
};
