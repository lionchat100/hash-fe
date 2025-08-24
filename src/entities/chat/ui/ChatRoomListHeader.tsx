import { NotificationButton } from '@/widgets/common/NotificationButton';

export const ChatRoomListHeader = () => {
  return (
    <header className="header-fixed-center flex h-(--space-h-header) items-center justify-center bg-white px-4 pt-(--safe-top)">
      <h1 className="text-xl font-semibold">채팅</h1>
      <div className="absolute top-4 right-4 h-6 w-6">
        <NotificationButton />
      </div>
    </header>
  );
};
