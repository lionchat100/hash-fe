import { create } from 'zustand';

interface ChatState {
  currentRoomId: number | null;
  isInRoom: boolean;
  subscribedRooms: Set<number>;
  isLoading: boolean;

  enterRoom: (roomId: number) => void; // 채팅방 입장 액션
  leaveRoom: (roomId?: number) => void; // 채팅방 퇴장 액션
  addSubscription: (roomId: number) => void; // 채팅방 구독 액션
  removeSubscription: (roomId: number) => void; // 채팅방 구독 해제 액션
  setLoading: (loading: boolean) => void; // 로딩 상태 설정
  clearChat: () => void; // 채팅방 초기화 액션
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

  leaveRoom: (roomId?: number) => {
    const { currentRoomId, removeSubscription } = get();
    const targetRoomId = roomId || currentRoomId;
    if (targetRoomId) {
      removeSubscription(targetRoomId);
      if (targetRoomId === currentRoomId) {
        set({
          currentRoomId: null,
          isInRoom: false,
        });
      }
    }
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
