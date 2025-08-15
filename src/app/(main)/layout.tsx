'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/widgets/common/NavBar';
import { StompProvider } from '../_providers';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedPaths = ['/explore', '/chats', '/feed', '/profile'];
  const isNavVisible = allowedPaths.includes(pathname);

  return (
    <StompProvider>
      <main>{children}</main>
      {isNavVisible && <NavBar />}
    </StompProvider>
  );
}
