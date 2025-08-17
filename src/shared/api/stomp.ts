'use client';

import { Client } from '@stomp/stompjs';
import { createContext, useContext } from 'react';

type StompContextType = {
  readonly client: Client | null;
  isConnected: boolean;
  reconnectWithNewToken?: (token: string) => void;
};

export const stompContext = createContext<StompContextType>({
  client: null,
  isConnected: false,
});

export const useStomp = () => useContext(stompContext);
