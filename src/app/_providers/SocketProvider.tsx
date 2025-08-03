'use client';

import { socketContext } from '@/shared/api/socket';
import { ReactNode, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new (Socket as any)(process.env.NEXT_PUBLIC_SOCKET_URL!, {});

    socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, isConnected }}>{children}</socketContext.Provider>
  );
};
