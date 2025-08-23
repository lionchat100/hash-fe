import { FeedItem } from '@/entities/feed/model/types';
import { useCoalescedToggleLike } from '@/features/update-feed/model/feedLikeToggle';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { Heart } from 'lucide-react';

export const LikeButton = ({ item }: { item: FeedItem }) => {
  const { id, isLiked, likeCount } = item.feed;
  const { toggle, syncing } = useCoalescedToggleLike(id, 450);

  return (
    <Button onClick={toggle} disabled={syncing} className="flex items-center gap-1" variant="zero">
      <Heart
        className={cn(
          'size-5 transition-all duration-150',
          isLiked ? 'fill-primary text-primary' : 'fill-none text-stone-500',
        )}
      />
      <span className="text-sm font-medium text-stone-600">{likeCount.toLocaleString()}</span>
    </Button>
  );
};
