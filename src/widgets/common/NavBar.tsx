'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/tailwindMerge';
import { House, MessageCircleMore, CircleUserRound, SquareChartGantt } from 'lucide-react';

const navItems = [
  { key: 'explore', Icon: House, label: '홈' },
  { key: 'chats', Icon: MessageCircleMore, label: '채팅' },
  { key: 'feed', Icon: SquareChartGantt, label: '광장' },
  { key: 'profile', Icon: CircleUserRound, label: '마이페이지' },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  const current = pathname?.split('/')[1] ?? navItems[0].key;
  const activeTab = navItems.find((item) => item.key === current)?.key ?? navItems[0].key;

  return (
    <nav className="fixed bottom-0 z-10 mx-auto flex h-(--space-h-nav) w-full max-w-(--space-max-layout) min-w-xs items-center justify-around border-t border-stone-400 bg-white">
      {navItems.map(({ key, Icon, label }) => {
        const isActive = key === activeTab;
        return (
          <Link
            key={key}
            className={cn(
              'flex h-12 min-w-12 grow-0 flex-col items-center justify-center gap-0.5',
              'text-xs text-stone-500',
              isActive && 'font-bold text-stone-900',
            )}
            href={`/${key}`}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
