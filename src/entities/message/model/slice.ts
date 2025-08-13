import { create } from 'zustand';
import { MessageRes, MessageList } from './types';

interface MessageState {
  messages: Record<number, MessageList>; // 채팅방별 메시지 목록 (roomId -> MessageRes[])
  currentRoomMessages: MessageList; // 현재 채팅방의 메시지들
  currentRoomId: number | null; // 현재 채팅방 ID
  isLoading: boolean; // 메시지 로딩 상태
  isLoadingMore: boolean; // 더 많은 메시지 로딩 상태
  hasMore: boolean; // 더 많은 메시지가 있는지 여부
  lastMessageId: string | null; // 마지막 메시지 ID

  setMessages: (roomId: number, messages: MessageList) => void; // 채팅방별 메시지 목록 설정
  addMessage: (roomId: number, message: MessageRes) => void; // 단일 메시지 추가
  addMessages: (roomId: number, messages: MessageList) => void; // 메시지들 추가
  prependMessages: (roomId: number, messages: MessageList) => void; // 메시지들 앞에 추가
  setCurrentRoomMessages: (roomId: number) => void; // 현재 채팅방 메시지 설정
  setLoading: (loading: boolean) => void; // 로딩 상태 설정
  setLoadingMore: (loading: boolean) => void; // 추가 로딩 상태 설정
  setHasMore: (hasMore: boolean) => void; // 더 불러올 메시지가 있는지 설정
  setLastMessageId: (messageId: string | null) => void; // 마지막 메시지 ID 설정
  clearMessages: (roomId?: number) => void; // 특정 채팅방 메시지 초기화
  clearAllMessages: () => void; // 모든 메시지 초기화
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: {},
  currentRoomMessages: [],
  currentRoomId: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  lastMessageId: null,

  // 메시지 설정
  setMessages: (roomId: number, messages: MessageList) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages,
      },
    }));
  },

  // 단일 메시지 추가 (새 메시지 수신 시)
  addMessage: (roomId: number, message: MessageRes) => {
    set((state) => {
      const existingMessages = state.messages[roomId] || [];
      const updatedMessages = [...existingMessages, message];

      return {
        messages: {
          ...state.messages,
          [roomId]: updatedMessages,
        },
        // 현재 채팅방이면 currentRoomMessages도 업데이트
        currentRoomMessages: state.currentRoomId === roomId ? updatedMessages : state.currentRoomMessages,
      };
    });
  },

  // 메시지들 추가 (초기 로드 시)
  addMessages: (roomId: number, messages: MessageList) => {
    set((state) => {
      const existingMessages = state.messages[roomId] || [];
      const updatedMessages = [...existingMessages, ...messages];
      return {
        messages: {
          ...state.messages,
          [roomId]: updatedMessages,
        },
      };
    });
  },

  // 메시지들 앞에 추가 (이전 메시지 로드 시)
  prependMessages: (roomId: number, messages: MessageList) => {
    set((state) => {
      const existingMessages = state.messages[roomId] || [];
      const updatedMessages = [...messages, ...existingMessages];
      return {
        messages: {
          ...state.messages,
          [roomId]: updatedMessages,
        },
      };
    });
  },

  // 현재 채팅방 메시지 설정
  setCurrentRoomMessages: (roomId: number) => {
    set((state) => ({
      currentRoomId: roomId, // 현재 채팅방 ID 설정
      currentRoomMessages: state.messages[roomId] || [],
    }));
  },

  // 로딩 상태 설정
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 추가 로딩 상태 설정
  setLoadingMore: (loading: boolean) => {
    set({ isLoadingMore: loading });
  },

  // 더 불러올 메시지가 있는지 설정
  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },

  // 마지막 메시지 ID 설정
  setLastMessageId: (messageId: string | null) => {
    set({ lastMessageId: messageId });
  },

  // 특정 채팅방 메시지 초기화
  clearMessages: (roomId?: number) => {
    if (roomId) {
      set((state) => {
        const newMessages = { ...state.messages };
        delete newMessages[roomId];
        return {
          messages: newMessages,
          // 현재 채팅방을 초기화하는 경우에만 currentRoomMessages도 초기화
          currentRoomMessages: state.currentRoomId === roomId ? [] : state.currentRoomMessages,
          currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId,
        };
      });
    } else {
      set({ currentRoomMessages: [], currentRoomId: null });
    }
  },

  // 모든 메시지 초기화
  clearAllMessages: () => {
    set({
      messages: {},
      currentRoomMessages: [],
      currentRoomId: null,
      hasMore: true,
      lastMessageId: null,
    });
  },
}));
