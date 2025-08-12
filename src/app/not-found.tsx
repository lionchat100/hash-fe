import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-48 w-48 items-center justify-center">토킷 이미지</div>
      <p className="font-display-sm pb-6 text-stone-900">올바른 주소인지 확인해주세요</p>
      <Link
        href="/explore"
        className="rounded-40 h-(--space-h-btn-lg) bg-stone-900 px-6 py-4 text-base font-medium text-stone-50"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
