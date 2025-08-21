'use client';

import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle } from '@/shared/ui/Drawer';
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

  const isEmpty = data?.pages.flatMap((page) => page.content).length === 0;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="h-dvh p-0">
        <DrawerTitle className="text-balck px-8 text-2xl font-semibold">댓글</DrawerTitle>
        <DrawerDescription className="hidden px-8 text-sm text-stone-500">
          댓글을 작성하고 다른 사람들과 소통해보세요.
        </DrawerDescription>

        <div className="mx-auto grid h-[calc(100dvh_-_var(--space-h-nav,0px))] w-full max-w-(--space-max-layout) grid-rows-[1fr_auto]">
          <div className="overflow-auto overscroll-contain px-8 pt-5 pb-8">
            {status === 'pending' && <div>불러오는 중…</div>}
            {status === 'error' && <div>댓글을 불러오지 못했어요.</div>}
            {status === 'success' &&
              // 댓글이 없을 때
              (isEmpty ? (
                <div className="font-display-sm flex h-full items-center justify-center">아직 댓글이 없어요</div>
              ) : (
                <div className="space-y-5">
                  {data?.pages.flatMap((page) =>
                    page.content.map((c) => <CommentCard key={c.id} item={c} onDeleted={markDirty} />),
                  )}
                </div>
              ))}

            {/* 무한 스크롤 트리거 */}
            {hasNextPage && <div ref={ref} className="h-1" />}
            {isFetchingNextPage && <div className="text-center text-sm">더 불러오는 중…</div>}
          </div>
        </div>

        <DrawerFooter
          className="gap-0 border-t bg-white px-4 pt-2"
          style={{
            paddingBottom: 'calc(var(--safe-bottom) + var(--kb-offset))',
          }}
        >
          <CommentInput feedId={feedId} disabled={!enabled} onPosted={markDirty} />
          <div className="h-2"></div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
