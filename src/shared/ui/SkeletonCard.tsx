//프로필 카드 로딩을 위한 Skeleton UI
export const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-lg border bg-gray-50 p-4 shadow-sm [animation-duration:1s]">
      {/* 이미지 영역 */}
      <div className="mb-4 h-64 w-full rounded-lg bg-gray-200" />

      {/* 프로필 정보 + 액션 버튼 영역 */}
      <div className="flex gap-4">
        {/* 프로필 정보 영역 */}
        <div className="flex-1 space-y-3">
          {/* 대학교 정보 */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>

          {/* 닉네임 */}
          <div className="h-6 w-32 rounded bg-gray-200" />

          {/* 자기소개 */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>

          {/* 태그들 */}
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* 액션 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <div className="h-4 w-4" />
          <div className="h-9 w-9 rounded-2xl bg-gray-200" />
          <div className="h-9 w-9 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

/**
 * 여러 개의 Skeleton 카드를 렌더링
 */
export const SkeletonCardList = ({ count }: { count: number }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
