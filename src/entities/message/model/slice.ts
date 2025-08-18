import { create } from 'zustand';

interface MessageState {
  messageDrafts: Record<number, string>;
  setMessageDraft: (roomId: number, draft: string) => void;
  clearMessageDraft: (roomId: number) => void;
  clearAllDrafts: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messageDrafts: {},

  setMessageDraft: (roomId, draft) => {
    const prev = get().messageDrafts[roomId];
    if (prev === draft) return; // 동일 값 렌더 방지
    set((state) => ({
      messageDrafts: { ...state.messageDrafts, [roomId]: draft },
    }));
  },

  clearMessageDraft: (roomId) => {
    set((state) => {
      const next = { ...state.messageDrafts };
      delete next[roomId];
      return { messageDrafts: next };
    });
  },

  clearAllDrafts: () => set({ messageDrafts: {} }),
}));
