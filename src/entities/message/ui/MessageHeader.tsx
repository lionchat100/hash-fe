import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ReportButton } from '@/widgets/common/ReportButton';

interface MessageHeaderProps {
  opponentNickname: string | null;
  opponentUserId: number;
}

export const MessageHeader = (props: MessageHeaderProps) => {
  const { opponentNickname, opponentUserId } = props;

  return (
    <header className="safe-pt header-abs-center flex h-(--space-h-header) w-full items-center justify-between bg-white px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/chats">
          <ChevronLeft className="size-6" />
        </Link>
      </Button>
      <Link href={`/profile/${opponentUserId}`}>
        <h1 className="text-xl font-semibold text-stone-900">{opponentNickname || ''}</h1>
      </Link>
      <ReportButton />
    </header>
  );
};
