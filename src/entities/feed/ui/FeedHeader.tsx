import { NotificationButton } from '@/widgets/common/NotificationButton';
import { ReportButton } from '@/widgets/common/ReportButton';

export const FeedHeader = () => {
  return (
    <>
      <header className="safe-pt relative flex h-(--space-h-header) items-center justify-between bg-white px-4">
        <ReportButton />
        <h1 className="text-xl font-semibold">게시판</h1>
        <NotificationButton />
      </header>
    </>
  );
};
