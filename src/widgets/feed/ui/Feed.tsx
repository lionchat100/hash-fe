'use client';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs';
import { FeedTabPanel } from '@/widgets/feed/ui/FeedTabPanel';
import { Sort } from '@/entities/feed/model/types';
import { useSearchParams } from 'next/navigation';

export default function FeedTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'latest';
  const [active, setActive] = React.useState<Sort>(tab as Sort);

  return (
    <div className="h-[calc(100vh-54px)] overflow-hidden px-4">
      <Tabs value={active} onValueChange={(v) => setActive(v as Sort)} className="h-full">
        <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3">
          <TabsTrigger value="latest">최신순</TabsTrigger>
          <TabsTrigger value="popular">인기순</TabsTrigger>
          <TabsTrigger value="my">내가 쓴 글</TabsTrigger>
        </TabsList>

        {/* 탭 패널들: 모두 마운트된 상태로 유지 */}
        <FeedTabPanel sort="latest" active={active === 'latest'} />
        <FeedTabPanel sort="popular" active={active === 'popular'} />
        <FeedTabPanel sort="my" active={active === 'my'} />
      </Tabs>
    </div>
  );
}
