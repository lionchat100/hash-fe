'use client';
import { useEffect, useRef } from 'react';
import type { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import { useNotificationStore } from '@/entities/notify/model/slice';
import { useStomp } from '@/shared/api/stomp';
import { useUserStore } from '@/entities/user/model/slice';

export const useAlarmSubscription = () => {
  const { client, isConnected } = useStomp();
  const userId = useUserStore((s) => s.currentUser?.id);
  const bump = useNotificationStore((s) => s.bump);
  const subRef = useRef<StompSubscription | null>(null);
  const prevTopicRef = useRef<string | null>(null);

  useEffect(() => {
    if (!client || !isConnected || !userId) {
      // 연결이 끊겼거나 userId가 사라지면 기존 구독 해제
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {}
        subRef.current = null;
        prevTopicRef.current = null;
      }
      return;
    }

    const topic = `/topic/alarm/${userId}`;

    // 중복 구독 방지
    if (prevTopicRef.current === topic && subRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ALARM] 이미 구독 중:', topic);
      }
      return;
    }

    // 이전 구독 정리
    if (subRef.current) {
      try {
        subRef.current.unsubscribe();
      } catch {}
      subRef.current = null;
    }

    // 메세지가 오기만 하면 dot을 켜는 방식
    const sub = (client as Client).subscribe(
      topic,
      (msg: IMessage) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('📩 [ALARM] message:', msg.body);
        }
        bump();
      },
      { ack: 'auto' },
    );

    subRef.current = sub;
    prevTopicRef.current = topic;

    return () => {
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {}
        subRef.current = null;
        prevTopicRef.current = null;
      }
    };
  }, [client, isConnected, userId, bump]);
};
