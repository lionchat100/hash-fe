'use client';

import { stompContext } from '@/shared/api/stomp';
import { Client, IFrame } from '@stomp/stompjs';
import { ReactNode, useEffect, useState } from 'react';

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_STOMP_URL!,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    stompClient.onConnect = () => {
      console.log('stomp connected');
      setIsConnected(true);
    };

    stompClient.onDisconnect = () => {
      console.log('stomp disconnected');
      setIsConnected(false);
    };

    stompClient.onStompError = (frame: IFrame) => {
      console.error('stomp error:', frame);
      setIsConnected(false);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log('stomp disconnected');
      stompClient.deactivate();
    };
  }, []);

  return <stompContext.Provider value={{ client, isConnected }}>{children}</stompContext.Provider>;
};
