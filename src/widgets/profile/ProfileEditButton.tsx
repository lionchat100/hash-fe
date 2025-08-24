import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

interface ProfileEditButtonProps {
  className?: string;
}

export const ProfileEditButton = ({ className }: ProfileEditButtonProps) => {
  const editPath = '/profile/edit';

  return (
    <div className={`mt-2 ${className ?? ''}`}>
      <Button className="h-14 w-full cursor-pointer rounded-4xl text-lg font-semibold" size="lg" asChild>
        <Link href={editPath}>프로필 수정하기</Link>
      </Button>
    </div>
  );
};
