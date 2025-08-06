'use client';

import { Client } from '@stomp/stompjs';
import { createContext, useContext } from 'react';

type StompContextType = {
  client: Client | null;
  isConnected: boolean;
};

export const stompContext = createContext<StompContextType>({
  client: null,
  isConnected: false,
});

export const useStomp = () => {
  return useContext(stompContext);
};
