'use client';
import { useState } from 'react';
import { FeedItem } from '@/entities/feed/model/types';
import { Button } from '@/shared/ui/Button';
import { CommentDrawer } from './CommentDrawer';
import { MessageSquare } from 'lucide-react';

export const Comment = ({ item }: { item: FeedItem }) => {
  const { commentCount } = item.feed;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="zero" className="flex items-center gap-1 !p-0" onClick={() => setOpen(true)}>
        <MessageSquare className="size-5 text-stone-500 transition-all duration-150" />
        <span className="text-sm font-medium text-stone-600">{commentCount.toLocaleString()}</span>
      </Button>
      <CommentDrawer feedId={item.feed.id} open={open} onOpenChange={setOpen} />
    </div>
  );
};
