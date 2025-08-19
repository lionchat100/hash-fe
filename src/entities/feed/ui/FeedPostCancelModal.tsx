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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>작성 중인 글이 있습니다</DialogTitle>
          <DialogDescription>작성중인 글이 저장되지 않고 사라집니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
