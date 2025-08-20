'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Bell } from 'lucide-react';

export const AlarmView = () => {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="이전 페이지로 돌아가기"
          >
            <ChevronLeft className="size-6 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">알림</h1>
          
          <div className="w-10" /> {/* 우측 공간 유지용 */}
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="mx-auto max-w-screen-md">
        <div className="p-4">
          {/* 임시 빈 상태 UI */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Bell className="size-8 text-gray-400" />
            </div>
            <h2 className="mb-2 text-lg font-medium text-gray-900">알림이 없습니다</h2>
            <p className="text-gray-500">새로운 알림이 있을 때 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};