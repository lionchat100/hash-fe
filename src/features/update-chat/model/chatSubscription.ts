/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';
import { StompSubscription } from '@stomp/stompjs';
import { useStomp } from '@/shared/api/stomp';
import { useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';

export const useChatSubscription = (roomId: number) => {
  const { client, isConnected } = useStomp();
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const { enterRoom, leaveRoom, addSubscription, removeSubscription, subscribedRooms } = useChatStore();
  const { addMessage } = useMessageStore();

  const isSubscribed = subscribedRooms.has(roomId);

  // 채팅방 구독
  const subscribeToRoom = useCallback(() => {
    if (!client || !isConnected) {
      console.warn(`채팅방 ${roomId} 구독 실패: STOMP 연결이 끊어졌습니다.`);
      return;
    }

    if (subscriptionRef.current) {
      console.warn(`채팅방 ${roomId}는 이미 구독 중입니다.`);
      return;
    }

    try {
      console.log(`채팅방 ${roomId} 구독 시작`);
      const subscription = client.subscribe(`/topic/chatroom/${roomId}`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          console.log('메시지 수신:', receivedMessage);
          addMessage(roomId, receivedMessage);
        } catch (error) {
          console.error('메시지 파싱 에러:', error);
        }
      });
      subscriptionRef.current = subscription;
      addSubscription(roomId);
      enterRoom(roomId);
      console.log(`채팅방 ${roomId} 구독 완료`);
    } catch (error) {
      console.error(`채팅방 ${roomId} 구독 중 오류 발생:`, error);
    }
  }, [client, isConnected, roomId]);

  // 채팅방 구독 해제
  const unsubscribeFromRoom = useCallback(() => {
    if (subscriptionRef.current) {
      console.log(`채팅방 ${roomId} 구독 해제 시작`);
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      removeSubscription(roomId);
      leaveRoom(roomId); // roomId 파라미터 추가
      console.log(`채팅방 ${roomId} 구독 해제 완료`);
    }
  }, [roomId, removeSubscription, leaveRoom]);

  // 채팅방 구독 상태 관리
  useEffect(() => {
    if (isConnected && !isSubscribed) {
      subscribeToRoom();
    } else if (!isConnected && subscriptionRef.current) {
      console.warn(`채팅방 ${roomId} 구독 해제: STOMP 연결이 끊어졌습니다.`);
      subscriptionRef.current = null;
      removeSubscription(roomId);
      leaveRoom(roomId); // roomId 파라미터 추가
    }
  }, [isConnected, isSubscribed, subscribeToRoom, roomId]);

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    return () => {
      unsubscribeFromRoom();
    };
  }, []);

  return {
    subscribeToRoom, // 채팅방 구독
    unsubscribeFromRoom, // 채팅방 구독 해제

    isSubscribed, // 채팅방 구독 상태
    isConnected, // 연결 상태
  };
};
