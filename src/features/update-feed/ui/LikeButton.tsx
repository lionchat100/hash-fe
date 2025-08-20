import { FeedItem } from '@/entities/feed/model/types';
import { useToggleLike } from '@/features/update-feed/model/feedLikeToggle';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { Heart } from 'lucide-react';

export const LikeButton = ({ item }: { item: FeedItem }) => {
  const toggle = useToggleLike();
  const { id, isLiked, likeCount } = item.feed;

  return (
    <Button
      onClick={() => toggle.mutate({ id })}
      disabled={toggle.isPending}
      className="flex items-center gap-1"
      variant="zero"
    >
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
