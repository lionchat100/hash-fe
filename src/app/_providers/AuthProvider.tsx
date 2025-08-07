'use client';

import api from '@/shared/api/axios';
import { authContext, User } from '@/shared/model/auth';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const login = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    setCookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setCookie('refreshToken', '', { expires: new Date(0) });
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  const checkAuth = async () => {
    try {
      const refreshToken = getCookie('refreshToken');
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      if (!refreshToken || !accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('error', error);
        try {
          const refreshResponse = await api.post('/auth/refresh', {
            refreshToken: refreshToken,
          });

          const { accessToken: newAccessToken } = refreshResponse.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', newAccessToken);
          }

          setUser(refreshResponse.data.user);
          setIsAuthenticated(true);
        } catch (refreshError) {
          console.error('인증 확인 중 오류:', refreshError);
          logout();
        }
      }
    } catch (error) {
      console.error('인증 확인 중 오류:', error);
      logout();
    }
  };

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, [checkAuth]);

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
