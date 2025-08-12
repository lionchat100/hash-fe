'use client';
import { usePathname } from 'next/navigation';
import NavBar from '@/widgets/common/NavBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedPaths = ['/explore', '/chats', '/feed', '/profile'];
  const isNavVisible = allowedPaths.includes(pathname);

  return (
    <div>
      <main>{children}</main>
      {isNavVisible && <NavBar />}
    </div>
  );
}
