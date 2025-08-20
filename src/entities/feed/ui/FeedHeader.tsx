import { Siren } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { NotificationBell } from '@/widgets/common/NotificationBell';

export const FeedHeader = () => {
  return (
    <>
      <header className="safe-pt relative flex h-(--space-h-header) items-center justify-between bg-white px-4">
        <Button variant="ghost" size="icon">
          <Siren className="size-6" />
        </Button>
        <h1 className="text-xl font-semibold">게시판</h1>
        <NotificationBell />
      </header>
    </>
  );
};
