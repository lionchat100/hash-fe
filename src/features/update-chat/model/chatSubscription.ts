import { useStomp } from '@/shared/api/stomp';
import { useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import { useCallback, useEffect, useRef } from 'react';
import { StompSubscription } from '@stomp/stompjs';

export const useChatSubscription = (roomId: number) => {
  const { client, isConnected } = useStomp();
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const { enterRoom, leaveRoom, addSubscription, removeSubscription, subscribedRooms } = useChatStore();
  const { addMessage } = useMessageStore();

  const isSubscribed = subscribedRooms.has(roomId);

  const subscribeToRoom = useCallback(() => {
    if (client && isConnected && !subscriptionRef.current) {
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
    }
  }, [client, isConnected, roomId, addMessage, addSubscription, enterRoom]);

  const unsubscribeFromRoom = useCallback(() => {
    if (subscriptionRef.current) {
      console.log(`채팅방 ${roomId} 구독 해제 시작`);
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      removeSubscription(roomId);
      leaveRoom();
      console.log(`채팅방 ${roomId} 구독 해제 완료`);
    }
  }, [roomId, removeSubscription, leaveRoom]);

  useEffect(() => {
    if (isConnected && !isSubscribed) {
      subscribeToRoom();
    } else if (!isConnected && subscriptionRef.current) {
      subscriptionRef.current = null;
    }
  }, [isConnected, isSubscribed, subscribeToRoom]);

  useEffect(() => {
    return () => {
      unsubscribeFromRoom();
    };
  }, [unsubscribeFromRoom]);

  return {
    subscribeToRoom,
    unsubscribeFromRoom,
    isSubscribed,
    isConnected,
  };
};
