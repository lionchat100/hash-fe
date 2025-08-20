import { FeedHeader, FeedFloatingButton } from '@/entities/feed/index';
import Feed from '@/widgets/feed/ui/Feed';

export const FeedView = () => {
  return (
    <div className="relative h-dvh">
      <FeedHeader />
      <Feed />
      <FeedFloatingButton />
    </div>
  );
};
