import clsx from 'clsx';
import { ChatRoom } from '../model/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { formatChatTime } from '@/shared/lib/dateUtils';

interface ChatRoomItemProps {
  className?: string;
  chatRoom: ChatRoom;
}

export const ChatRoomItem = (props: ChatRoomItemProps) => {
  const { chatRoom } = props;
  return (
    <Link href={`/chats/${chatRoom.chatRoomId}`} className={clsx(props.className)}>
      <div className="flex h-20 items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-grow items-center gap-3">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={chatRoom.imageUrl} alt={chatRoom.name} />
            <AvatarFallback className="bg-gray-300">{chatRoom.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="mb-1 truncate text-base font-medium">{chatRoom.name}</p>
            <div className="truncate text-sm text-gray-500">{chatRoom.lastContent}</div>
          </div>
        </div>
        <div className="flex h-full flex-shrink-0 flex-col items-end justify-center">
          <div className="mb-1 text-sm text-gray-500">{formatChatTime(chatRoom.lastSendAt)}</div>
          <div className={clsx('h-4 w-4 rounded-full', chatRoom.isRead ? 'bg-transparent' : 'bg-blue-500')}></div>
        </div>
      </div>
    </Link>
  );
};
