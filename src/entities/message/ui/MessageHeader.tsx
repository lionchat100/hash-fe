import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ReportButton } from '@/widgets/common/ReportButton';

interface MessageHeaderProps {
  opponentNickname: string | null;
}

export const MessageHeader = (props: MessageHeaderProps) => {
  const { opponentNickname } = props;

  return (
    <header className="safe-pt relative flex h-(--space-h-header) items-center justify-between bg-white px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/chats">
          <ChevronLeft className="size-7" />
        </Link>
      </Button>
      <h1 className="text-xl font-semibold text-stone-900">{opponentNickname || ''}</h1>
      <ReportButton />
    </header>
  );
};
