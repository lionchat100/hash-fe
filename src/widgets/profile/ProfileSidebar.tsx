'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet';
import Link from 'next/link';
import { Heart, FileText, Bell, Megaphone, FileCheck, Shield, MessageSquare } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileSidebar = ({ isOpen, onClose }: Props) => {
  const menuCategories = [
    {
      title: '내 계정',
      items: [
        { icon: FileText, label: '게시글 관리', href: '/my/posts' },
        { icon: Heart, label: '내가 좋아요한 사람', href: '/my/likes' },
      ],
    },
    {
      title: '앱 설정',
      items: [{ icon: Bell, label: '알림', href: '/settings/notifications' }],
    },
    {
      title: '정보',
      items: [
        { icon: Megaphone, label: '공지사항', href: '/info/notices' },
        { icon: FileCheck, label: '이용약관', href: '/info/terms' },
        { icon: Shield, label: '개인정보 처리방침', href: '/info/privacy' },
        { icon: MessageSquare, label: '문의하기', href: '/info/contact' },
      ],
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 [&>button>svg]:size-4.5">
        <SheetHeader>
          <SheetTitle>마이페이지</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4">
          {/* 카테고리별 메뉴 */}
          {menuCategories.map((category) => (
            <div key={category.title}>
              {/* 카테고리 제목 */}
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">{category.title}</h3>

              {/* 카테고리 내 메뉴 항목들 */}
              <nav className="space-y-1">
                {category.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                    onClick={onClose}
                  >
                    <item.icon className="size-5 text-gray-600" />
                    <span className="text-gray-900">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="py-1" />
              <div className="border-t" />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
