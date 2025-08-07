import { createContext, useContext } from 'react';

// TODO: User Entities 의 Shared 계층 침범 문제 생각하기
export interface User {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const authContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
  checkAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error('useAuth 는 AuthProvider 내에서만 사용할 수 있습니다.');
  }
  return context;
};
