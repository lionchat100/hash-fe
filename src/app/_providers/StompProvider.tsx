'use client';

import { ReactNode, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { stompContext } from '@/shared/api/stomp';
import { refreshManager } from '@/shared/api/refreshManager';
import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 멀티탭 토큰 동기화용 BroadcastChannel
const bc = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

// 스탬피드 방지용 지수 백오프 알고리즘
// 150밀리초 ~ 3초 사이 랜덤 지수 백오프
function backoff(attempt: number) {
  const base = Math.min(3000, 150 * Math.pow(2, attempt));
  return base + Math.floor(Math.random() * 200);
}

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false); // 연결 상태
  const retryTimerRef = useRef<number | null>(null); // 재연결 대기 타이머
  const clientRef = useRef<Client | null>(null); // 클라이언트 인스턴스
  const tokenRef = useRef<string | null>(null); // 현재 토큰
  const reconnectAttemptRef = useRef<number>(0); // 재연결 시도 횟수
  const suppressCloseRef = useRef(false); // 스탬피드 방지용 플래그
  const switchingRef = useRef(false); // 스탬피드 방지용 플래그
  const mountedRef = useRef(true); // 마운트 상태

  // 재연결 대기 타이머 초기화
  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  // 클라이언트 생성
  const createStompClient = useCallback((token: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_STOMP_URL!),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      // debug: () => {}, // 프로덕션 디버깅 메시지 비활성화
      beforeConnect: async () => {
        // 토큰 파싱으로 만료 시간 확인 및 프리리프레시 시도
        try {
          const now = Date.now() / 1000;
          const raw = token.split('.')[1];
          const { exp } = JSON.parse(atob(raw));
          if (exp - now < 60) {
            console.log('토큰 만료 시간이 60초 이내입니다. 토큰 갱신 시도');
            const { accessToken } = await refreshManager.refresh();
            tokenRef.current = accessToken;
            stompClient.connectHeaders = { Authorization: `Bearer ${accessToken}` };
          }
        } catch {
          console.error('STOMP PROVIDER: 토큰 파싱 프리리프레시 실패');
        }
      },
    });

    stompClient.onConnect = () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
      console.log('STOMP PROVIDER 로깅: 연결 성공');
    };
    stompClient.onDisconnect = () => {
      setIsConnected(false);
      console.log('STOMP PROVIDER 로깅: 연결 끊김');
    };
    stompClient.onStompError = async (frame: IFrame) => {
      setIsConnected(false);
      const message = frame.headers?.message || '';
      const body = frame.body || '';
      const isExpired = message.includes('401') || body.includes('401');
      if (isExpired) {
        console.log('STOMP PROVIDER 로깅: 토큰 만료 감지 - 토큰 재발급 시도');
        try {
          const { accessToken } = await refreshManager.refresh();
          await safeRecreate(accessToken);
          console.log('STOMP PROVIDER 로깅: 토큰 재발급 성공 - 재연결 시도');
        } catch {
          await safeDeactivate();
        }
      } else {
        await retryReconnect();
      }
    };
    stompClient.onWebSocketClose = async () => {
      setIsConnected(false);
      if (suppressCloseRef.current) return;
      await retryReconnect();
    };
    return stompClient;
  }, []);

  // 클라이언트 비활성화
  const safeDeactivate = useCallback(async () => {
    const prev = clientRef.current;
    if (prev) {
      try {
        suppressCloseRef.current = true;
        await prev.deactivate();
      } catch {
        prev.forceDisconnect();
      } finally {
        clientRef.current = null;
        setTimeout(() => {
          suppressCloseRef.current = false;
        }, 50);
      }
    }
  }, []);

  // 클라이언트 재생성
  const safeRecreate = useCallback(
    async (token: string) => {
      if (switchingRef.current) return;
      switchingRef.current = true;
      try {
        clearRetryTimer();
        await safeDeactivate();
        const next = createStompClient(token);
        clientRef.current = next;
        tokenRef.current = token;
        next.activate();
      } finally {
        switchingRef.current = false;
      }
    },
    [createStompClient, safeDeactivate],
  );

  // 재연결 시도
  const retryReconnect = useCallback(async () => {
    const attempt = ++reconnectAttemptRef.current;
    const delay = backoff(attempt);
    await new Promise<void>((resolve) => {
      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null;
        resolve();
      }, delay);
    });
    const token = tokenRef.current || localStorage.getItem('accessToken');
    if (token) await safeRecreate(token);
  }, [safeRecreate]);

  // 초기 연결
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      tokenRef.current = token;
      const stompClient = createStompClient(token);
      clientRef.current = stompClient;
      stompClient.activate();
    }
    return () => {
      safeDeactivate();
    };
  }, [createStompClient, safeDeactivate]);

  // 토큰 재발급 감지
  useEffect(() => {
    const off = refreshManager.onToken(async (newToken) => {
      tokenRef.current = newToken;
      await safeRecreate(newToken);
    });
    return () => {
      off();
    };
  }, [safeRecreate]);

  // 멀티탭 토큰 동기화
  useEffect(() => {
    if (!bc) return;
    const onMessage = (event: MessageEvent<string>) => {
      if (!event.data) return;
      tokenRef.current = event.data;
      safeRecreate(event.data);
    };
    bc.addEventListener('message', onMessage);
    return () => bc.removeEventListener('message', onMessage);
  }, [safeRecreate]);

  // 마운트 상태 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearRetryTimer();
      suppressCloseRef.current = true;
    };
  }, []);

  // 컨텍스트 값 계산
  const value = useMemo(
    () => ({
      get client() {
        return clientRef.current;
      },
      isConnected,
      reconnect: async () => {
        const token = tokenRef.current || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
        if (token) {
          await safeRecreate(token);
        }
      },
    }),
    [isConnected, safeRecreate],
  );

  return <stompContext.Provider value={value as any}>{children}</stompContext.Provider>;
};
