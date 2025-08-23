import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/entities/user';
import { FeedItem } from '@/entities/feed/model/types';
import { LikeButton } from '@/features/update-feed/ui/LikeButton';
import { Comment } from '@/features/update-comment/ui/CommentButton';
import { formatRelativeTime } from '@/shared/lib/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useDeleteFeed } from '@/features/update-feed/model/feedDelete';
import { toast } from 'sonner';

interface Props {
  className?: string;
  item: FeedItem;
  sortMy: boolean;
}

export const FeedCard = (props: Props) => {
  const route = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);

  const { currentUser } = useUserStore();
  const { item, sortMy } = props;
  const isMyFeed = currentUser?.id === props.item.writer.id;

  const handleDeleteClick = () => {
    setShowWarningModal(true);
  };

  const del = useDeleteFeed();

  const onDelete = async () => {
    if (del.isPending) return;

    try {
      await del.mutateAsync(item.feed.id);
      toast.success('삭제되었습니다');
    } catch (e) {
      console.error('❌ delete failed', e);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 py-4 last:border-0">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => route.push(isMyFeed ? `/profile` : `/profile/${item.writer.id}`)}
          >
            <div className="flex-shrink-0">
              <Avatar className="size-7">
                <AvatarImage src={item.writer.imageUrl} alt={item.writer.nickname} />
                <AvatarFallback className="text-xs">{item.writer.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-sm font-medium text-stone-900">{item.writer.nickname}</div>
          </div>
          <div className="text-xs text-stone-700">{formatRelativeTime(item.feed.createdAt)}</div>
        </div>
        {/* 삭제 기능 추가 */}
        {isMyFeed && sortMy && (
          <Button variant="zero" onClick={handleDeleteClick} className="px-2 py-1 text-xs font-normal text-stone-500">
            삭제
          </Button>
        )}
      </div>
      <div className="space-y-2 pb-2">
        <div className="line-clamp-2 text-2xl font-bold [overflow-wrap:anywhere] break-all text-stone-900">
          {item.feed.title}
        </div>
        <div className="line-clamp-[12] w-full text-base font-medium [overflow-wrap:anywhere] break-all text-stone-800">
          {item.feed.content}
        </div>
      </div>
      <div className="flex gap-4">
        <LikeButton item={item} />
        <Comment item={item} />
      </div>
      <ConfirmDialog
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        onDelete={onDelete}
        onCancel={() => setShowWarningModal(false)}
      />
    </div>
  );
};
