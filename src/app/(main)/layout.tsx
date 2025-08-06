import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      {/* 네비게이션 추가 */}
      <div className="fixed right-0 bottom-0 left-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button>
              <Link href="/explore">탐색</Link>
            </Button>
            <Button>
              <Link href="/chats">채팅</Link>
            </Button>
            <Button>
              <Link href="/profile">내 프로필</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
