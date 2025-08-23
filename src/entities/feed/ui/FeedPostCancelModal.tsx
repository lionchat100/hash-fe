import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';

interface FeedPostCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FeedPostCancelModal = ({ open, onOpenChange, onConfirm, onCancel }: FeedPostCancelModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="!max-w-[340px] overflow-hidden bg-stone-50 px-0 pb-0">
        <DialogHeader className="gap-4 pb-3 !text-center">
          <DialogTitle>뒤로가기</DialogTitle>
          <DialogDescription>작성 중인 글이 저장되지 않고 사라집니다</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-0 border-t border-stone-400">
          <Button variant="ghost" onClick={onCancel} className="w-1/2 rounded-none border-r border-stone-400">
            취소
          </Button>
          <Button variant="ghost" onClick={onConfirm} className="text-link w-1/2 rounded-none">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
