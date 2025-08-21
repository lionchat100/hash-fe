import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';

interface FeedPostHeaderProps {
  onComplete?: () => void;
  isSubmitting?: boolean;
  isFormValid?: boolean;
  onBackButtonClick?: () => void;
}

export const FeedPostHeader = ({
  onComplete,
  isSubmitting = false,
  isFormValid = false,
  onBackButtonClick,
}: FeedPostHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" className="size-14" onClick={onBackButtonClick}>
        <ChevronLeft className="size-6" />
      </Button>
      <h1 className="text-xl font-semibold">게시판</h1>
      <Button
        variant="ghost"
        size="sm"
        className="bg-transparent text-base font-semibold disabled:bg-transparent"
        onClick={onComplete}
        disabled={isSubmitting || !isFormValid}
      >
        완료
      </Button>
    </div>
  );
};
