import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/tailwindMerge';

interface CheckConfirmDialoglProps {
  available: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const CheckConfirmDialog = ({ open, onOpenChange, onConfirm, available }: CheckConfirmDialoglProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="!max-w-[340px] overflow-hidden bg-stone-50 px-0 pb-0">
        <DialogHeader className="items-center gap-4 pb-3">
          <DialogTitle className={cn('text-success', !available && 'text-error')}>
            {available ? '사용 가능' : '사용 불가'}
          </DialogTitle>
          <DialogDescription>{available ? '사용 가능한 닉네임입니다' : '사용 불가능한 닉네임입니다'}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-0 border-t border-stone-400">
          <Button variant="ghost" onClick={onConfirm} className="text-link hover:text-link w-full rounded-none">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
