import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

type Props = {
  profileId?: string;
  className?: string;
};

export const ProfileEditButton = ({ profileId, className }: Props) => {
  // 프로필 수정 페이지 경로 생성
  const editPath = profileId ? `/profile/edit/${profileId}` : '/profile/edit';

  return (
    <div className={`mt-6 ${className ?? ''}`}>
      <Button className="h-14 w-full cursor-pointer rounded-4xl text-lg font-semibold" size="lg" asChild>
        <Link href={editPath}>프로필 수정하기</Link>
      </Button>
    </div>
  );
};
