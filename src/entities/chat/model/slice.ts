import { create } from 'zustand';

interface ChatState {
  currentRoomId: number | null;
  isInRoom: boolean;
  subscribedRooms: Set<number>;
  isLoading: boolean;

  enterRoom: (roomId: number) => void;
  leaveRoom: () => void;
  addSubscription: (roomId: number) => void;
  removeSubscription: (roomId: number) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentRoomId: null,
  isInRoom: false,
  subscribedRooms: new Set(),
  isLoading: false,

  enterRoom: (roomId: number) => {
    set({
      currentRoomId: roomId,
      isInRoom: true,
    });
  },

  leaveRoom: () => {
    const { currentRoomId, removeSubscription } = get();
    if (currentRoomId) {
      removeSubscription(currentRoomId);
    }
    set({
      currentRoomId: null,
      isInRoom: false,
    });
  },

  addSubscription: (roomId: number) => {
    set((state) => ({
      subscribedRooms: new Set([...state.subscribedRooms, roomId]),
    }));
  },

  removeSubscription: (roomId: number) => {
    set((state) => {
      const newSubscriptions = new Set(state.subscribedRooms);
      newSubscriptions.delete(roomId);
      return { subscribedRooms: newSubscriptions };
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearChat: () => {
    set({
      currentRoomId: null,
      isInRoom: false,
      subscribedRooms: new Set(),
      isLoading: false,
    });
  },
}));
