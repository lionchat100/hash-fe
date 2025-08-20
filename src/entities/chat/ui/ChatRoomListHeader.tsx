import { NotificationBell } from '@/widgets/common/NotificationBell';

export const ChatRoomListHeader = () => {
  return (
    <header className="safe-pt relative flex h-(--space-h-header) items-center justify-center bg-white px-4">
      <h1 className="text-xl font-semibold">채팅</h1>
      <div className="absolute top-2 right-2">
        <NotificationBell />
      </div>
    </header>
  );
};
