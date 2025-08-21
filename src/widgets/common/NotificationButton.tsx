'use client';
import { useNotificationStore } from '@/entities/notify/model/slice';
import { Button } from '@/shared/ui/Button';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export const NotificationButton = () => {
  const hasNew = useNotificationStore((s) => s.hasNew);

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/notify" aria-label="알림 보기" className="relative flex items-center justify-center">
        <Bell className="size-6 text-gray-700" />
        {hasNew && (
          <span className="bg-primary absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white" />
        )}
      </Link>
    </Button>
  );
};
