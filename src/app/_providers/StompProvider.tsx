'use client';

import { stompContext } from '@/shared/api/stomp';
import { Client, IFrame } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!token) {
      console.log('stomp 연결 실패: 토큰이 없습니다.');
      router.push('/');
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_STOMP_URL!),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // 재연결 설정
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 4000, // 하트비트 수신 주기
      heartbeatOutgoing: 4000, // 하트비트 전송 주기
    });

    stompClient.onConnect = () => {
      console.log('stomp 연결 성공');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    stompClient.onDisconnect = () => {
      console.log('stomp 연결 끊김');
      setIsConnected(false);
    };

    stompClient.onStompError = (frame: IFrame) => {
      console.error('stomp 오류:', frame);
      setIsConnected(false);

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`stomp 재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`);
      } else {
        console.log('stomp 최대 재연결 시도 횟수 초과');
      }
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log('stomp 연결 끊김');
      stompClient.deactivate();
    };
  }, []);

  return <stompContext.Provider value={{ client, isConnected }}>{children}</stompContext.Provider>;
};
