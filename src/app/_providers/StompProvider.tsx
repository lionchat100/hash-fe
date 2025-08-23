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
      debug: () => {},
      beforeConnect: async () => {
        try {
          const now = Date.now() / 1000;
          const raw = token.split('.')[1];
          const { exp } = JSON.parse(atob(raw));
          if (exp - now < 60) {
            const { accessToken } = await refreshManager.refresh();
            tokenRef.current = accessToken;
            stompClient.connectHeaders = { Authorization: `Bearer ${accessToken}` };
          }
        } catch {}
      },
    });

    stompClient.onConnect = () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
    };
    stompClient.onDisconnect = () => {
      setIsConnected(false);
    };
    stompClient.onStompError = async (frame: IFrame) => {
      setIsConnected(false);
      const message = frame.headers?.message || '';
      const body = frame.body || '';
      const isExpired = message.includes('401') || body.includes('401');
      if (isExpired) {
        try {
          const { accessToken } = await refreshManager.refresh();
          await safeRecreate(accessToken);
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
  }, [safeRecreate]);

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

  useEffect(() => {
    const off = refreshManager.onToken(async (newToken) => {
      tokenRef.current = newToken;
      await safeRecreate(newToken);
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
    return () => {
      mountedRef.current = false;
      clearRetryTimer();
      suppressCloseRef.current = true;
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
