'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import { ProfileSidebar } from './ProfileSidebar';

export const ProfileHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3">
          {/* 햄버거 메뉴 */}
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="size-6" />
          </Button>

          {/* 제목 */}
          <div className="text-lg font-semibold">프로필</div>

          {/* 알림 버튼 - Link로 변경 */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alarm">
              <Bell className="size-6" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 사이드바 */}
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
