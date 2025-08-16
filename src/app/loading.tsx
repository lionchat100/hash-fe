'use client';
export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="rounded-40 h-(--space-h-btn-lg) bg-stone-800 px-6 py-4 text-base font-medium text-stone-50">
        페이지로 진입하고 있어요!
      </div>
      <div className="flex h-48 w-48 items-center justify-center">임시 토킷 이미지 구역</div>
      <div className="font-display-sm pb-14 text-stone-900">
        <p>로딩중이에요</p>
        <p>조금만 기다려주세요</p>
      </div>
    </div>
  );
}
