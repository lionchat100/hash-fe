import { NotificationButton } from '@/widgets/common/NotificationButton';

export const ChatRoomListHeader = () => {
  return (
    <header className="safe-pt header-abs-center flex h-(--space-h-header) w-full items-center justify-center bg-white px-4">
      <h1 className="text-xl font-semibold">채팅</h1>
      <div className="absolute top-4 right-4 h-6 w-6">
        <NotificationButton />
      </div>
    </header>
  );
};
