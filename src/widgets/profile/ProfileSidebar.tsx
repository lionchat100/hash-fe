'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet';
import Link from 'next/link';
import { Heart, Megaphone, FileCheck, Shield, Siren } from 'lucide-react';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  external?: boolean;
};

export const ProfileSidebar = ({ isOpen, onClose }: Props) => {
  const menuCategories: Array<{ title: string; items: MenuItem[] }> = [
    {
      title: '내 계정',
      items: [{ icon: Heart, label: '내가 좋아요한 사람', href: '/profile/likes', external: false }],
    },
    {
      title: '정보',
      items: [
        {
          icon: Megaphone,
          label: '공지사항',
          href: 'https://www.notion.so/Tokit-25711797709c80e293e0fb041451ab63',
          external: true,
        },
        {
          icon: FileCheck,
          label: '이용약관',
          href: 'https://www.notion.so/Tokit-25711797709c80c18febcda57f0c95be',
          external: true,
        },
        {
          icon: Shield,
          label: '개인정보 처리방침',
          href: 'https://www.notion.so/Tokit-25711797709c80c18febcda57f0c95be',
          external: true,
        },
        {
          icon: Siren,
          label: '신고하기',
          href: 'https://docs.google.com/forms/d/e/1FAIpQLScwrZktsbUG3Q2AqPYNVH4cutyaJy1pO71XKLgqDbJJOVz7yg/viewform',
          external: true,
        },
      ],
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-72 [&>button]:focus:!ring-0 [&>button]:focus:!ring-offset-0 [&>button>svg]:size-5"
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex h-full flex-col space-y-6 px-4">
          <div className="space-y-6">
            {menuCategories.map((category) => (
              <div key={category.title}>
                <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-900 uppercase">{category.title}</h3>

                <nav className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return item.external ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                        onClick={onClose}
                        aria-label={item.label}
                      >
                        <Icon className="size-5 text-gray-500" />
                        <span className="font-semibold text-gray-500">{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                        onClick={onClose}
                        prefetch
                        aria-label={item.label}
                      >
                        <Icon className="size-5 text-gray-500" />
                        <span className="font-semibold text-gray-500">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="py-2" />
                <div className="border-t" />
              </div>
            ))}
          </div>

          <div className="mt-auto pb-4">
            <div className="mb-3 flex justify-center">
              <Image src="/images/Tokit_produce.svg" alt="Tokit Produce" width={400} height={100} />
            </div>
            <p className="text-center text-[7px] text-gray-300">
              PM_NYH OCY KHH FE_KYW PSM SH BE_JWJ LSH RSB YCM DS_LYJ PSA
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
