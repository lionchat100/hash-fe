import { CommentItem } from '@/entities/comment/model/types';
import { useUserStore } from '@/entities/user';
import { formatRelativeTime } from '@/shared/lib/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';

interface Props {
  item: CommentItem;
}

export const CommentCard = (props: Props) => {
  const { item } = props;
  const { currentUser } = useUserStore();
  const isMyComment = item.writer.id === currentUser?.id;

  const onDelet = () => {
    alert(`${item.id} 삭제기능?`);
  };

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <Avatar className="size-7">
              <AvatarImage src={item.writer.imageUrl} alt={item.writer.nickname} />
              <AvatarFallback className="text-xs">{item.writer.nickname.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium text-stone-900">{item.writer.nickname}</div>
          <div className="text-xs text-stone-700">{formatRelativeTime(item.createdAt)}</div>
        </div>
        {isMyComment && (
          <Button variant="zero" onClick={onDelet} className="px-2 py-1 text-xs font-normal text-stone-500">
            삭제
          </Button>
        )}
      </div>
      <div className="pr-1.5 pl-9 text-sm">{item.content}</div>
    </div>
  );
};
