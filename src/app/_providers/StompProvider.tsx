'use client';

import { stompContext } from '@/shared/api/stomp';
import { tokenEventBus } from '@/shared/lib/tokenEventBus';
import { Client, IFrame } from '@stomp/stompjs';
import { ReactNode, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import SockJS from 'sockjs-client';

const bc = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const switchingRef = useRef(false);

  const createStompClient = useCallback((token: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_STOMP_URL!),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {}, // 프로덕션 디버깅 메시지 비활성화
    });

    stompClient.onConnect = () => setIsConnected(true);
    stompClient.onDisconnect = () => setIsConnected(false);
    stompClient.onStompError = (frame: IFrame) => {
      console.error('STOMP 오류:', frame.headers?.message, frame.body);
      setIsConnected(false);
    };
    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };
    return stompClient;
  }, []);

  const activateWithToken = useCallback(
    async (token: string) => {
      if (!token) return; // 로그아웃 시 연결 끊기
      if (currentTokenRef.current === token && clientRef.current?.active) return;
      if (switchingRef.current) return;
      switchingRef.current = true;

      const prev = clientRef.current;
      if (prev) {
        try {
          await prev.deactivate();
        } catch {
          // 비활성화 실패 시 무시
        }
      }
      const next = createStompClient(token);
      clientRef.current = next;
      currentTokenRef.current = token;
      next.activate();
    },
    [createStompClient],
  );

  const reconnectWithNewToken = useCallback(
    (newToken: string) => {
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = window.setTimeout(() => {
        activateWithToken(newToken);
        bc?.postMessage(newToken);
      }, 150);
    },
    [activateWithToken],
  );

  // 초기 연결
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) activateWithToken(token);
  }, [activateWithToken]);

<<<<<<< HEAD
    if (!token) {
      console.log('STOMP 연결 실패: 토큰이 없습니다.');

      // 개발 환경에서는 토큰이 없어도 페이지 접근 허용
      if (process.env.NODE_ENV === 'development') {
        console.log('개발 환경: 토큰 없이도 페이지 접근 허용');
        return;
      }

      // 프로덕션 환경에서는 홈으로 리다이렉트
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
=======
  // 토큰 변경 감지
>>>>>>> 66d5ab7d8eaa4fe877b09a86bb59fdf05396807f
  useEffect(() => {
    const unsubscribe = tokenEventBus.subscribe(reconnectWithNewToken);
    return unsubscribe;
  }, [reconnectWithNewToken]);

  // 멀티탭 전파 감지
  useEffect(() => {
    if (!bc) return;
    const onMsg = (e: MessageEvent<string>) => {
      if (!e.data) return;
      reconnectWithNewToken(e.data);
    };
    bc.addEventListener('message', onMsg);
    return () => bc.removeEventListener('message', onMsg);
  }, [reconnectWithNewToken]);

  const value = useMemo(
    () => ({
      get client() {
        return clientRef.current;
      },
      isConnected,
      reconnectWithNewToken,
    }),
    [isConnected, reconnectWithNewToken],
  );

  return <stompContext.Provider value={value as any}>{children}</stompContext.Provider>;
};
