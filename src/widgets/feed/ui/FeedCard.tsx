import { formatRelativeTime } from '@/shared/lib/dateUtils';
import { FeedItem } from '../../../entities/feed/model/types';
// import { cn } from '@/shared/lib/tailwindMerge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { useUserStore } from '@/entities/user';
import { EllipsisVertical } from 'lucide-react';
import { LikeButton } from '../../../features/update-feed/ui/LikeButton';
import { Comment } from '../../../features/update-comment/ui/Comment';

interface Props {
  className?: string;
  item: FeedItem;
}

export const FeedCard = (props: Props) => {
  const { currentUser } = useUserStore();
  const { item } = props;
  const isMyFeed = currentUser?.id === props.item.writer.id;

  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 py-3 last:border-0">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0">
            <Avatar className="size-7">
              <AvatarImage src={item.writer.imageUrl} alt={item.writer.nickname} />
              <AvatarFallback className="text-xs">{item.writer.nickname.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium text-stone-900">{item.writer.nickname}</div>
          <div className="text-xs text-stone-700">{formatRelativeTime(item.feed.createdAt)}</div>
        </div>
        {/* 삭제 기능 추가 */}
        {isMyFeed && <EllipsisVertical size="3" />}
      </div>
      <div className="space-y-1">
        <div className="text-lg font-bold text-stone-900">{item.feed.title}</div>
        <div className="font-medium text-stone-800">{item.feed.content}</div>
      </div>
      <div className="flex gap-4">
        <LikeButton item={item} />
        <Comment item={item} />
      </div>
    </div>
  );
};
