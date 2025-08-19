import clsx from 'clsx';
import { MessageRes } from '@/entities/message';
import { useUserStore } from '@/entities/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { formatChatTime } from '@/shared/lib/dateUtils';

interface MessageBubbleProps {
  className?: string;
  message: MessageRes;
  showAvatar?: boolean;
  showName?: boolean;
  showTime?: boolean;
  isGrouped?: boolean;
}

export const MessageBubble = (props: MessageBubbleProps) => {
  const { currentUser } = useUserStore();
  const { message, showAvatar, showName, showTime } = props;
  const isMyMessage = currentUser?.id === props.message.id;

  return (
    <div
      className={clsx('flex w-full gap-2 px-4 py-1', isMyMessage ? 'justify-end' : 'justify-start', props.className)}
    >
      {/* 왼쪽 정렬 (다른 사람 메시지) */}
      {!isMyMessage && (
        <>
          {/* 아바타 */}
          {showAvatar && (
            <div className="flex-shrink-0">
              <Avatar className="size-10">
                <AvatarImage src={message.imageUrl} alt={message.nickname} />
                <AvatarFallback className="text-xs">{message.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          {/* 메시지 컨텐츠 */}
          <div className={clsx('flex max-w-[90%] flex-col', showTime && 'mb-3')}>
            {showName && <span className="mb-2 text-base font-semibold">{message.nickname}</span>}
            <div className="flex items-end gap-2">
              <div className={clsx('bg-muted rounded-[8px] px-[10px] py-[10px] text-base', !showAvatar && 'ml-12')}>
                {message.content}
              </div>
              {showTime && <span className="flex-shrink-0 text-xs">{formatChatTime(message.createdAt)}</span>}
            </div>
          </div>
        </>
      )}

      {/* 오른쪽 정렬 (내 메시지) */}
      {isMyMessage && (
        <>
          {/* 메시지 컨텐츠 */}
          <div className={clsx('flex max-w-[90%] flex-col items-end', showTime && 'mb-3')}>
            {/* 메시지 버블과 시간 */}
            <div className="flex items-end gap-2">
              {/* 시간 */}
              {showTime && <span className="flex-shrink-0 text-xs">{formatChatTime(message.createdAt)}</span>}
              <div className="bg-muted rounded-[8px] px-[10px] py-[10px] text-base">{message.content}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
