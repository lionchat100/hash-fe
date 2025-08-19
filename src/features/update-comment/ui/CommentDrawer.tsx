// features/comments/ui/CommentDrawer.tsx
'use client';

import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from '@/shared/ui/Drawer';
import { useCommentsInfinite } from '../model/commentLoad';
import { useInView } from 'react-intersection-observer';
import { CommentInput } from './CommentInput';
import { CommentCard } from './CommentCard';
import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  feedId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function CommentDrawer({ feedId, open, onOpenChange }: Props) {
  const enabled = open && !!feedId;

  const qc = useQueryClient();
  const dirtyRef = useRef(false);
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    // 닫힐 때만 feeds 리패치
    if (!v && dirtyRef.current) {
      qc.invalidateQueries({ queryKey: ['feeds'] });
      dirtyRef.current = false;
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useCommentsInfinite(feedId ?? 0, enabled);

  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="h-[60vh] bg-white">
        <DrawerTitle className="text-balck px-8 text-2xl font-semibold">댓글</DrawerTitle>

        <div className="flex-1 space-y-4 overflow-y-auto px-8 py-5">
          {status === 'pending' && <div>불러오는 중…</div>}
          {status === 'error' && <div>댓글을 불러오지 못했어요.</div>}
          {status === 'success' && (
            <div className="space-y-5">
              {data?.pages.flatMap((page) =>
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
            </div>
          )}

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && <div ref={ref} className="h-8" />}
          {isFetchingNextPage && <div className="text-center text-sm">더 불러오는 중…</div>}
        </div>

        <DrawerFooter className="shadow-(--box-shadow-top)">
          <CommentInput feedId={feedId} disabled={!enabled} onPosted={markDirty} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
