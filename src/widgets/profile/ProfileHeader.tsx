'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Menu } from 'lucide-react';
import { ProfileSidebar } from './ProfileSidebar';
import { NotificationButton } from '../common/NotificationButton';

export const ProfileHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="safe-pt relative flex h-(--space-h-header) items-center justify-between bg-white px-4">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="size-6" />
        </Button>
        <h1 className="text-xl font-semibold">프로필</h1>
        <NotificationButton />
      </header>

      {/* 사이드바 */}
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
