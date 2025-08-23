import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';
import { DialogKind } from '../model/types';
import { PRESET_COPY } from '../constants/constant';

interface ConfirmDialogProps {
  type?: DialogKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ type = 'delete', open, onOpenChange, onDelete, onCancel }: ConfirmDialogProps) => {
  const preset = PRESET_COPY[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="!max-w-[340px] overflow-hidden bg-stone-50 px-0 pb-0">
        <DialogHeader className="gap-4 pb-3 !text-center">
          <DialogTitle>{preset.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">{preset.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-0 border-t border-stone-400">
          <Button variant="ghost" onClick={onCancel} className="w-1/2 rounded-none border-r border-stone-400">
            {preset.cancelLabel}
          </Button>
          <Button variant="ghost" onClick={onDelete} className="text-error w-1/2 rounded-none">
            {preset.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
