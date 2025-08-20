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
      <h1>게시판</h1>
      <Button className="size-14 disabled:bg-white" onClick={onComplete} disabled={isSubmitting || !isFormValid}>
        완료
      </Button>
    </div>
  );
};
