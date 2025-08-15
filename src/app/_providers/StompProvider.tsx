'use client';

import { stompContext } from '@/shared/api/stomp';
import { tokenEventBus } from '@/shared/lib/tokenEventBus';
import { Client, IFrame } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const router = useRouter();
  const currentTokenRef = useRef<string | null>(null);

  // STOMP 클라이언트 생성 함수
  const createStompClient = useCallback(
    (token: string) => {
      const stompClient = new Client({
        webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_STOMP_URL!),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = () => {
        console.log('STOMP 연결 성공');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      stompClient.onDisconnect = () => {
        console.log('STOMP 연결 끊김');
        setIsConnected(false);
      };

      stompClient.onStompError = (frame: IFrame) => {
        console.error('STOMP 오류:', frame);
        setIsConnected(false);

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`STOMP 재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`);
        } else {
          console.log('STOMP 최대 재연결 시도 횟수 초과');
        }
      };

      return stompClient;
    },
    [maxReconnectAttempts],
  );

  // 토큰 변경 시 재연결
  const reconnectWithNewToken = useCallback(
    (newToken: string) => {
      // 같은 토큰이면 재연결하지 않음
      if (currentTokenRef.current === newToken) {
        return;
      }

      console.log('새로운 토큰으로 STOMP 재연결 시도');

      // 기존 클라이언트가 있으면 비활성화
      if (client) {
        client.deactivate();
      }

      // 새로운 클라이언트 생성 및 연결
      const newStompClient = createStompClient(newToken);
      newStompClient.activate();
      setClient(newStompClient);
      currentTokenRef.current = newToken;
    },
    [client, createStompClient],
  );

  // 초기 연결
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!token) {
      console.log('STOMP 연결 실패: 토큰이 없습니다.');
      router.push('/');
      return;
    }

    currentTokenRef.current = token;
    const stompClient = createStompClient(token);
    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log('STOMP 연결 끊김');
      stompClient.deactivate();
    };
  }, [router, createStompClient]);

  // 토큰 변경 감지 (의존성 배열에서 client 제거)
  useEffect(() => {
    const unsubscribe = tokenEventBus.subscribe(reconnectWithNewToken);
    return unsubscribe;
  }, [reconnectWithNewToken]);

  return <stompContext.Provider value={{ client, isConnected }}>{children}</stompContext.Provider>;
};
