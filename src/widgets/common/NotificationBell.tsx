'use client';
import { useNotificationStore } from '@/entities/notify/model/slice';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export const NotificationBell = () => {
  const hasNew = useNotificationStore((s) => s.hasNew);

  return (
    <Link
      href="/notify"
      aria-label="알림 보기"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
    >
      <Bell className="size-6 text-gray-700" />
      {hasNew && (
        <span className="bg-primary absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white" />
      )}
    </Link>
  );
};
