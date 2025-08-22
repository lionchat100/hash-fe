'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/tailwindMerge';
import { navItems } from './libs/nav';

export default function NavBar() {
  const pathname = usePathname();

  const current = pathname?.split('/')[1] ?? navItems[0].key;
  const activeTab = navItems.find((item) => item.key === current)?.key ?? navItems[0].key;

  return (
    <nav className="nav-fixed z-50 mx-auto flex w-full max-w-(--space-max-layout) min-w-xs items-center justify-around border-t border-stone-400 bg-white">
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
