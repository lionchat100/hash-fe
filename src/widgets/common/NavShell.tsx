'use client';
import { usePathname } from 'next/navigation';
import { AlarmSubscriber } from '@/features/update-notify/ui/AlarmSubscriber';
import NavBar from './NavBar';

export default function NavShell({ children }: { children: React.ReactNode }) {
  const allowedPaths = ['/explore', '/chats', '/feed', '/profile'];
  const pathname = usePathname();
  const isNavVisible = allowedPaths.includes(pathname);

  return (
    <>
      <AlarmSubscriber />
      <main>{children}</main>
      {isNavVisible && <NavBar />}
    </>
  );
}
