import clsx from 'clsx';
import Link from 'next/link';
import { ChevronLeft, EllipsisVertical } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface MessageHeaderProps {
  className?: string;
  personName: string | null;
}

export const MessageHeader = (props: MessageHeaderProps) => {
  const { personName } = props;

  return (
    <div className={clsx(props.className)}>
      <div className="flex items-center justify-between bg-white">
        <Link href="/chats">
          <Button variant="ghost" size="icon" className="p-7">
            <ChevronLeft className="size-6" />
          </Button>
        </Link>
        <div className="text-lg font-medium">{personName}</div>
        <Button variant="ghost" size="icon" className="p-7">
          <EllipsisVertical className="size-6" />
        </Button>
      </div>
    </div>
  );
};
