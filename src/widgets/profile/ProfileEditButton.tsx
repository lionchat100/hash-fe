import { useUserStore } from '@/entities/user';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

interface ProfileEditButtonProps {
  className?: string;
}

export const ProfileEditButton = ({ className }: ProfileEditButtonProps) => {
  // 현재 로그인된 사용자의 프로필 수정 페이지로 이동
  const { currentUser } = useUserStore();

  const isTestUser = currentUser?.id === 2 || currentUser?.id === 31;
  const editPath = isTestUser ? '/profile/editdrawer' : '/profile/edit';

  return (
    <div className={`mt-2 ${className ?? ''}`}>
      <Button className="h-14 w-full cursor-pointer rounded-4xl text-lg font-semibold" size="lg" asChild>
        <Link href={editPath}>프로필 수정하기</Link>
      </Button>
    </div>
  );
};
