'use client';

import { ReactNode, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { stompContext } from '@/shared/api/stomp';
import { refreshManager } from '@/shared/api/refreshManager';
import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const bc = typeof window !== 'undefined' ? new BroadcastChannel('accessToken') : null;

function backoff(attempt: number) {
  const base = Math.min(3000, 150 * Math.pow(2, attempt));
  return base + Math.floor(Math.random() * 200);
}

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const retryTimerRef = useRef<number | null>(null);
  const clientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const suppressCloseRef = useRef(false);
  const switchingRef = useRef(false);
  const mountedRef = useRef(true);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const createStompClient = useCallback((token: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_STOMP_URL!),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      // debug: () => {},
      beforeConnect: async () => {
        try {
          const now = Date.now() / 1000;
          const raw = token.split('.')[1];
          const { exp } = JSON.parse(atob(raw));
          if (exp - now < 60) {
            console.log('[STOMP PROVIDER] 토큰 만료 시간이 60초 이내입니다. 토큰 갱신 시도');
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
      console.log('[STOMP PROVIDER] 연결 성공 - onConnect');
    };
    stompClient.onDisconnect = () => {
      setIsConnected(false);
      console.log('[STOMP PROVIDER] 연결 끊김 - onDisconnect');
    };
    stompClient.onStompError = async (frame: IFrame) => {
      setIsConnected(false);
      const message = frame.headers?.message || '';
      const body = frame.body || '';
      const isExpired = message.includes('401') || body.includes('401');
      if (isExpired) {
        console.log('[STOMP PROVIDER] 401 수신!!! 토큰 만료로 재발급 시도 - onStompError');
        try {
          const { accessToken } = await refreshManager.refresh();
          await safeRecreate(accessToken);
          console.log('[STOMP PROVIDER] 토큰 재발급 성공으로 재연결 시도 - onStompError');
        } catch {
          await safeDeactivate();
          console.log('[STOMP PROVIDER] 토큰 재발급 실패로 클라이언트 비활성화 시도 - onStompError');
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

  const safeDeactivate = useCallback(async () => {
    const prev = clientRef.current;
    if (prev) {
      try {
        suppressCloseRef.current = true;
        await prev.deactivate();
        console.log('[STOMP PROVIDER] 이전 클라이언트 비활성화 성공 - safeDeactivate');
      } catch {
        prev.forceDisconnect();
        console.log('[STOMP PROVIDER] 이전 클라이언트 비활성화 실패, 강제 연결 해제 - safeDeactivate');
      } finally {
        clientRef.current = null;
        setTimeout(() => {
          suppressCloseRef.current = false;
        }, 50);
      }
    }
  }, []);

  const safeRecreate = useCallback(
    async (token: string) => {
      if (switchingRef.current) return;
      switchingRef.current = true;
      try {
        clearRetryTimer();
        await safeDeactivate();
        tokenRef.current = token;
        const next = createStompClient(token);
        clientRef.current = next;
        tokenRef.current = token;
        next.activate();
        console.log('[STOMP PROVIDER] 새 클라이언트 생성 성공 - safeRecreate', token);
      } finally {
        switchingRef.current = false;
      }
    },
    [createStompClient, safeDeactivate],
  );

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
    console.log('[STOMP PROVIDER] 재연결 시도 성공 - retryReconnect', token);
  }, [safeRecreate]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      tokenRef.current = token;
      const stompClient = createStompClient(token);
      clientRef.current = stompClient;
      stompClient.activate();
      console.log('[STOMP PROVIDER] 초기 연결 성공 - useEffect', token);
    }
    return () => {
      safeDeactivate();
    };
  }, [createStompClient, safeDeactivate]);

  useEffect(() => {
    const off = refreshManager.onToken(async (newToken) => {
      tokenRef.current = newToken;
      await safeRecreate(newToken);
      console.log('[STOMP PROVIDER] 토큰 재발급 감지 해제 - useEffect');
    });
    return () => {
      off();
    };
  }, [safeRecreate]);

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

  useEffect(() => {
    mountedRef.current = true;
    console.log('[STOMP PROVIDER] 마운트 상태 관리 - useEffect');
    return () => {
      mountedRef.current = false;
      clearRetryTimer();
      suppressCloseRef.current = true;
      console.log('[STOMP PROVIDER] 마운트 해제 - useEffect');
    };
  }, []);

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
