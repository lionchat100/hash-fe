import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar';
import { NotificationCardData } from '../model/types';
import Link from 'next/link';

interface Props {
  item: NotificationCardData;
}

export const NotifyCard = (props: Props) => {
  const { item: notification } = props;
  return (
    <Link href={notification.href} className="flex w-full items-center gap-2.5 py-2.5">
      <Avatar className="size-[50px]">
        <AvatarImage src={notification.imageUrl} alt={notification.nickname} />
        <AvatarFallback className="text-xs">{notification.nickname.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="w-[calc(100% - 60px)] flex grow-1 justify-between">
        <div>
          <div className="text-base font-semibold text-stone-900">{notification.title}</div>
          <div className="pt-1 text-xs text-stone-700">{notification.body}</div>
        </div>
        <div className="text-xs text-stone-500">{notification.createdAt}</div>
      </div>
    </Link>
  );
};
