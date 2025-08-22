'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';
import { PolicyContent } from './PolicyContent';
import type { PolicyDoc } from '@/entities/policy/model/types';
import { useRef, useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: PolicyDoc;
}

export const PolicyDialog = ({ open, onOpenChange, doc }: Props) => {
  const [isEnd, setIsEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setIsEnd(true);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mx-auto block h-dvh max-w-(--space-max-layout) min-w-xs rounded-none p-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex h-(--space-h-header) items-center justify-center">
          <DialogTitle className="text-center text-xl font-bold text-stone-900">{doc.title}</DialogTitle>
          <DialogDescription className="sr-only">약관 페이지 입니다.</DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-6 pb-10">
          <div
            ref={scrollRef}
            className="scrollbar-hide h-[calc(100dvh-110px)] overflow-y-auto pb-6"
            onScroll={handleScroll}
          >
            <PolicyContent doc={doc} />
          </div>
        </div>

        <DialogFooter className="absolute top-4 right-4">
          <Button
            disabled={!isEnd}
            onClick={() => onOpenChange(false)}
            variant="zero"
            className="text-stone-900 disabled:bg-transparent"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
