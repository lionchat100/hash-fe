export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const STOMP_URL = process.env.NEXT_PUBLIC_STOMP_URL!;
export const OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL!;

// API 엔드포인트 모음
export const Endpoints = {
  users: {
    me: '/users/me',
    onboarding: '/users/onboarding',
    cardList: '/users/card/list',
    myCard: '/users/profile',
  },
  auth: {
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  chats: {
    sendRest: '/chats/message',
    // STOMP 목적지 예시: /app/chat.sendMessage
  },
} as const;
