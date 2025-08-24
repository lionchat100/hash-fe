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
    <header className="header-sticky bg-white px-4 pt-(--safe-top)">
      <div className="flex h-(--space-h-header) items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chats">
            <ChevronLeft className="size-6" />
          </Link>
        </Button>
        <Link href={`/profile/${opponentUserId}`}>
          <h1 className="text-xl font-semibold text-stone-900">{opponentNickname || ''}</h1>
        </Link>
        <ReportButton />
      </div>
    </header>
  );
};
