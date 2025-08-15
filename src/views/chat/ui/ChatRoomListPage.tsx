import { ChatRoomListHeader } from '@/entities/chat';
import { ChatRoomList } from '@/widgets/chat';

export const ChatRoomListPage = () => {
  return (
    <>
      <ChatRoomListHeader />
      <ChatRoomList />
    </>
  );
};
