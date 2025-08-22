'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet';
import Link from 'next/link';
import { Heart, Megaphone, FileCheck, Shield, MessageCircleQuestionMark } from 'lucide-react';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileSidebar = ({ isOpen, onClose }: Props) => {
  const menuCategories = [
    {
      title: '내 계정',
      items: [{ icon: Heart, label: '내가 좋아요한 사람', href: '/profile/likes' }],
    },
    {
      title: '정보',
      items: [
        { icon: Megaphone, label: '공지사항', href: '/info/notices' },
        { icon: FileCheck, label: '이용약관', href: '/info/terms' },
        { icon: Shield, label: '개인정보 처리방침', href: '/info/privacy' },
        { icon: MessageCircleQuestionMark, label: '문의하기', href: '/info/contact' },
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
          {/* 카테고리별 메뉴 */}
          <div className="space-y-6">
            {menuCategories.map((category) => (
              <div key={category.title}>
                {/* 카테고리 제목 */}
                <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-900 uppercase">{category.title}</h3>

                {/* 카테고리 내 메뉴 항목들 */}
                <nav className="space-y-1">
                  {category.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                      onClick={onClose}
                    >
                      <item.icon className="size-5 text-gray-500" />
                      <span className="font-semibold text-gray-500">{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="py-2" />
                <div className="border-t" />
              </div>
            ))}
          </div>

          {/* 하단 로고 및 텍스트 */}
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
