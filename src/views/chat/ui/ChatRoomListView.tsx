import { ChatRoomListHeader } from '@/entities/chat';
import { ChatRoomList } from '@/widgets/chat';

export const ChatRoomListView = () => {
  return (
    <>
      <ChatRoomListHeader />
      <ChatRoomList />
    </>
  );
};
