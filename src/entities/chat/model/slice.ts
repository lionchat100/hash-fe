import { create } from 'zustand';

interface ChatState {
  currentRoomId: number | null;
  personName: string | null;
  isLoading: boolean;
  isInRoom: () => boolean;
  setCurrentRoom: (roomId: number | null) => void;
  setPersonName: (otherName: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentRoomId: null,
  personName: null,
  isLoading: false,
  isInRoom: () => get().currentRoomId !== null,
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  setPersonName: (personName: string | null) => set({ personName: personName }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearChat: () => set({ currentRoomId: null, personName: null, isLoading: false }),
}));
