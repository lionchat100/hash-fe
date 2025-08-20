import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  hasNew: boolean;
  bump: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      hasNew: false,
      bump: () => set({ hasNew: true }),
      clear: () => set({ hasNew: false }),
    }),
    { name: 'notification-dot' },
  ),
);
