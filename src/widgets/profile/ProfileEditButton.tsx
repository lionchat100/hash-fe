import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

export const ProfileEditButton = (className: string) => {
  // 현재 로그인된 사용자의 프로필 수정 페이지로 이동
  const editPath = '/profile/edit';

  return (
    <div className={`mt-2 ${className ?? ''}`}>
      <Button className="h-14 w-full cursor-pointer rounded-4xl text-lg font-semibold" size="lg" asChild>
        <Link href={editPath}>프로필 수정하기</Link>
      </Button>
    </div>
  );
};
