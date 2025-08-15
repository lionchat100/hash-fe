import { create } from 'zustand';
import { MessageRes, MessageList } from './types';

interface MessageState {
  messages: Record<number, MessageList>;
  currentRoomMessages: MessageList;
  currentRoomId: number | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  lastMessageId: string | null;
  setMessages: (roomId: number, messages: MessageList) => void;
  addMessage: (roomId: number, message: MessageRes) => void;
  prependMessages: (roomId: number, messages: MessageList) => void;
  setCurrentRoomMessages: (roomId: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setLastMessageId: (messageId: string | null) => void;
  clearMessages: (roomId?: number) => void;
  clearAllMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: {},
  currentRoomMessages: [],
  currentRoomId: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  lastMessageId: null,

  setMessages: (roomId: number, messages: MessageList) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages,
      },
    }));
  },

  addMessage: (roomId: number, message: MessageRes) => {
    set((state) => {
      const existingMessages = state.messages[roomId] || [];
      const updatedMessages = [...existingMessages, message];
      return {
        messages: {
          ...state.messages,
          [roomId]: updatedMessages,
        },
        currentRoomMessages: state.currentRoomId === roomId ? updatedMessages : state.currentRoomMessages,
      };
    });
  },

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

  setCurrentRoomMessages: (roomId: number) => {
    set((state) => ({
      currentRoomId: roomId,
      currentRoomMessages: state.messages[roomId] || [],
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setLoadingMore: (loading: boolean) => {
    set({ isLoadingMore: loading });
  },

  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },

  setLastMessageId: (messageId: string | null) => {
    set({ lastMessageId: messageId });
  },

  clearMessages: (roomId?: number) => {
    if (roomId) {
      set((state) => {
        const newMessages = { ...state.messages };
        delete newMessages[roomId];
        return {
          messages: newMessages,
          currentRoomMessages: state.currentRoomId === roomId ? [] : state.currentRoomMessages,
          currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId,
        };
      });
    } else {
      set({ currentRoomMessages: [], currentRoomId: null });
    }
  },

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
