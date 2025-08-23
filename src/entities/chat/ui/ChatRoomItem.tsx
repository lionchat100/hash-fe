import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { formatChatTime } from '@/shared/lib/dateUtils';
import { ChatRoom } from '@/entities/chat/model/types';
import { useChatStore } from '@/entities/chat';
import Link from 'next/link';
import clsx from 'clsx';

interface ChatRoomItemProps {
  className?: string;
  chatRoom: ChatRoom;
}

export const ChatRoomItem = (props: ChatRoomItemProps) => {
  const { chatRoom } = props;
  const { setPersonName } = useChatStore();

  const handleRoomClick = () => {
    setPersonName(chatRoom.nickname);
  };

  return (
    <Link href={`/chats/${chatRoom.chatRoomId}`} className="flex h-20 gap-3 px-4 py-3" onClick={handleRoomClick}>
      <Avatar className="h-14 w-14">
        <AvatarImage src={chatRoom.imageUrl} alt={chatRoom.nickname} />
        <AvatarFallback className="bg-gray-300">{chatRoom.nickname.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-grow flex-col justify-center">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="line-clamp-1 overflow-hidden text-base font-medium text-ellipsis">{chatRoom.nickname}</p>
          <p className="flex-shrink-0 text-sm text-gray-500">{formatChatTime(chatRoom.lastSendAt)}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="line-clamp-2 overflow-hidden text-sm text-ellipsis text-gray-500">{chatRoom.lastContent}</p>
          <div
            className={clsx('h-2 w-2 flex-shrink-0 rounded-full', chatRoom.isRead ? 'bg-transparent' : 'bg-primary')}
          ></div>
        </div>
      </div>
    </Link>
  );
};
