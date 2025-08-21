import clsx from 'clsx';
import Link from 'next/link';
import { ChevronLeft, Siren } from 'lucide-react';
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
          <Button variant="ghost" size="icon" className="p-[27px]">
            <ChevronLeft className="size-7 stroke-stone-900" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-stone-900">{personName || '대화'}</h1>
        <Button variant="ghost" size="icon" className="p-[27px]">
          <Siren className="size-7 stroke-stone-900" />
        </Button>
      </div>
    </div>
  );
};
