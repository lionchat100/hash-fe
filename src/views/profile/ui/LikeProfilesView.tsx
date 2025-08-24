import { LikeProfileCard, LikeProfilesHeader, useLikeProfilesQuery } from '@/entities/user';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

export const LikeProfilesView = () => {
  const { ref, inView } = useInView();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useLikeProfilesQuery();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <FallbackScreen text="좋아요한 사람 목록을 불러오는 중이에요" fullScreen />;
  }

  if (error) {
    return <div>문제가 발생했어요</div>; // TODO: 에러 상태 표시 컴포넌트 추가
  }

  const allProfiles = data?.pages.flatMap((page) => page.content) ?? [];

  if (allProfiles.length === 0) {
    return <div>아직 좋아요한 사람이 없어요</div>; // TODO: 빈 상태 표시 컴포넌트 추가
  }

  return (
    <div className="min-h-dvh">
      <LikeProfilesHeader />

      <div className="scroll-content">
        {allProfiles.map((profile) => (
          <LikeProfileCard key={profile.userId} profile={profile} />
        ))}

        {/* 무한 스크롤 트리거 */}
        {hasNextPage ? (
          <div ref={ref} className="h-4 w-full">
            {isFetchingNextPage && (
              <div className="py-4 text-center">
                <p>더 많은 프로필을 불러오는 중이에요</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground p-3 text-center text-xs">
            <p>모든 프로필을 불러왔어요</p>
          </div>
        )}
      </div>
    </div>
  );
};
