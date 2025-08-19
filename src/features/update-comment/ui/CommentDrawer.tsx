// features/comments/ui/CommentDrawer.tsx
'use client';

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/Drawer';
import { useCommentsInfinite } from '../model/commentLoad';
import { useInView } from 'react-intersection-observer';
import { CommentInput } from './CommentInput';
import { CommentCard } from './CommentCard';

type Props = {
  feedId: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function CommentDrawer({ feedId, open, onOpenChange }: Props) {
  const enabled = open && !!feedId;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useCommentsInfinite(feedId ?? 0, enabled);

  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[75vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>댓글</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {status === 'pending' && <div>불러오는 중…</div>}
          {status === 'error' && <div>댓글을 불러오지 못했어요.</div>}
          {status === 'success' &&
            data?.pages.flatMap((page) =>
              page.content.map((c) => (
                <CommentCard
                  key={c.id}
                  item={c}
                  // feedId={feedId}
                  // onOpenChange={onOpenChange}
                  // className="border-b border-stone-200 last:border-0"
                />
              )),
            )}

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && <div ref={ref} className="h-8" />}
          {isFetchingNextPage && <div className="text-center text-sm">더 불러오는 중…</div>}
        </div>

        <DrawerFooter className="border-t">
          <CommentInput feedId={feedId} disabled={!enabled} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
