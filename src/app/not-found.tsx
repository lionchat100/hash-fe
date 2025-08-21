import Link from 'next/link';
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="font-display-md text-center">Not Found</div>
      <div className="pt-4.5 pb-4">
        <Image
          src="/images/logo/tokit_loading.svg"
          alt="Loading"
          width={140}
          height={140}
          priority
          className="h-full w-full"
        />
      </div>
      <p className="font-display-sm pb-6 text-center text-stone-900">
        길을 잃으신 것 같아요
        <br />
        저희가 홈으로 안내해드릴게요!
      </p>
      <Link
        href="/explore"
        className="rounded-40 h-(--space-h-btn-lg) bg-stone-900 px-6 py-4 text-base font-medium text-stone-50"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
