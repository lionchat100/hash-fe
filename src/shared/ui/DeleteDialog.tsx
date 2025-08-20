import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteDialog = ({ open, onOpenChange, onDelete, onCancel }: CancelDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="bg-stone-50 px-0 pb-0">
        <DialogHeader className="gap-4 pb-3">
          <DialogTitle>삭제</DialogTitle>
          <DialogDescription>
            삭제하면 복구가 불가능해요 <br />
            정말 삭제하시겠어요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-0 border-t border-stone-400">
          <Button variant="ghost" onClick={onCancel} className="w-1/2 rounded-none border-r border-stone-400">
            취소
          </Button>
          <Button variant="ghost" onClick={onDelete} className="text-error w-1/2 rounded-none">
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
