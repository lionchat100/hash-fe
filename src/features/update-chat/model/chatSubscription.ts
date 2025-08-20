import { useCallback, useEffect, useRef } from 'react';
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { useStomp } from '@/shared/api/stomp';
import { useChatStore } from '@/entities/chat';
import { pushLiveMessage } from '@/features/update-chat';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/entities/user';
import { MessageRes } from '@/entities/message';

export const useChatSubscription = (roomId: number) => {
  const { client, isConnected } = useStomp();
  const { currentRoomId, setPersonName, personName } = useChatStore();
  const { currentUser } = useUserStore();
  const queryClient = useQueryClient();

  const subRef = useRef<StompSubscription | null>(null);
  const ackedRef = useRef<Set<string>>(new Set());

  const isActiveRoom = currentRoomId === roomId;
  const shouldSubscribe = isConnected && isActiveRoom;

  const sendAck = useCallback(
    (messageId: string, id: number) => {
      if (!client || !client.connected || !currentUser) return;
      if (!isActiveRoom) return;
      if (id === currentUser.id) return;
      if (ackedRef.current.has(messageId)) return;
      ackedRef.current.add(messageId);
      try {
        client.publish({
          destination: '/app/message.ack',
          body: JSON.stringify({ messageId, id: currentUser.id }),
          headers: { 'content-type': 'application/json' },
        });
      } catch (error) {
        ackedRef.current.delete(messageId);
        console.error('ack publish failed:', error);
      }
    },
    [client, currentUser, isActiveRoom],
  );

  const onMessage = useCallback(
    (frame: IMessage) => {
      try {
        const message: MessageRes = JSON.parse(frame.body);
        if (message.chatRoomId !== roomId) return;
        if (!isActiveRoom) return;
        pushLiveMessage(queryClient, roomId, message);
        if (!personName && currentUser && message.id !== currentUser.id) {
          setPersonName(message.nickname);
        }
        sendAck(message.messageId, message.id);
      } catch (error) {
        console.error('message parsing failed:', error);
      }
    },
    [roomId, isActiveRoom, queryClient, sendAck, personName, currentUser, setPersonName],
  );

  useEffect(() => {
    if (shouldSubscribe && !subRef.current && client) {
      subRef.current = client.subscribe(`/topic/chatroom/${roomId}`, onMessage, {
        ack: 'client-individual',
      });
      ackedRef.current = new Set();
    }
    if ((!shouldSubscribe || !client) && subRef.current) {
      subRef.current.unsubscribe();
      subRef.current = null;
    }
    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
        subRef.current = null;
      }
    };
  }, [shouldSubscribe, client, roomId, onMessage]);

  return {
    isActiveRoom,
    shouldSubscribe,
    isConnected,
  };
};
