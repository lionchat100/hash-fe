'use client';

import { useRef, useCallback } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle } from '@/shared/ui/Drawer';
import { useCommentsInfinite } from '../model/commentLoad';
import { useInView } from 'react-intersection-observer';
import { CommentInput } from './CommentInput';
import { CommentCard } from './CommentCard';
import { useQueryClient } from '@tanstack/react-query';
import { useKeyboardOffset } from '@/shared/model/useKeyBoardOffset';

type Props = {
  feedId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function CommentDrawer({ feedId, open, onOpenChange }: Props) {
  const enabled = open && !!feedId;
  useKeyboardOffset();

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

  const count = (data?.pages ?? []).reduce((acc, p) => acc + (p?.content?.length ?? 0), 0);
  const isEmpty = count === 0;

  // 댓글 작성시 스크롤 이동
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    const anchor = bottomRef.current;
    if (anchor?.scrollIntoView) {
      anchor.scrollIntoView({ block: 'end', behavior: smooth ? 'smooth' : 'auto' });
    } else {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // DOM 업데이트 직후에 돌도록 두 번 감싸기
  const scrollToBottomDeferred = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToBottom(true)));
  }, [scrollToBottom]);

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="h-[70svh] max-h-[70svh] overflow-hidden bg-white p-0 md:h-[70dvh] md:max-h-[70dvh]">
        <div className="flex h-full flex-col">
          <div className="shrink-0 px-8 pb-5">
            <DrawerTitle className="bg-white text-2xl font-semibold text-black">댓글</DrawerTitle>
            <DrawerDescription className="hidden text-sm text-stone-500">
              댓글을 작성하고 다른 사람들과 소통해보세요.
            </DrawerDescription>
          </div>

          <div
            ref={scrollRef}
            className="pb-safe-input mb-12 min-h-0 overflow-auto px-8"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarGutter: 'stable both-edges',
              // 자동 스크롤 시 마지막 아이템이 sticky footer에 가리지 않도록
              scrollPaddingBottom: 'calc(var(--space-h-nav) + env(safe-area-inset-bottom, 0px))',
            }}
          >
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
                  <div ref={bottomRef} />
                </div>
              ))}

            {/* 무한 스크롤 트리거 */}
            {hasNextPage && <div ref={ref} className="h-1" />}
            {isFetchingNextPage && <div className="text-center text-sm">더 불러오는 중…</div>}
          </div>

          <DrawerFooter className="input-fixed border-t bg-white px-4 pt-2">
            <CommentInput
              feedId={feedId}
              disabled={!enabled}
              onPosted={() => {
                markDirty();
                scrollToBottomDeferred();
              }}
            />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
