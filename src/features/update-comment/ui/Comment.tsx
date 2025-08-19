'use client';
import { FeedItem } from '@/entities/feed/model/types';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/Drawer';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

export const Comment = ({ item }: { item: FeedItem }) => {
  const { commentCount } = item.feed;
  const [open, setOpen] = useState(false);
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTitle className="hidden">댓글</DrawerTitle>
      <DrawerTrigger asChild>
        <Button variant="zero" className="flex items-center gap-1 !p-0">
          <MessageSquare className={cn('size-5 text-stone-500 transition-all duration-150')} />
          <span className="text-sm font-medium text-stone-600">{commentCount.toLocaleString()}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5 px-8"></DrawerContent>
    </Drawer>
  );
};
