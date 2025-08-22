'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../../shared/lib/tailwindMerge';

export interface FallbackScreenProps {
  fullScreen?: boolean;
  type?: 'loading' | 'error' | 'hold';
  className?: string;
  image?: string;
  size?: number;
  text?: string;
  smallText?: string;
  hasButtonLink?: string;
  buttonText?: string;
}

export const FallbackScreen = ({
  type = 'loading',
  fullScreen = false,
  className = '',
  image = 'loading',
  size = 160,
  text = '진행중이에요',
  smallText = '',
  hasButtonLink = '',
  buttonText = '',
}: FallbackScreenProps) => {
  const containerClass = fullScreen ? 'fixed inset-0 z-60 bg-white bg-opacity-90' : 'w-full';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center">
        <div className="animate-wiggle mb-4" style={{ width: size, height: size }}>
          <Image
            src={`/images/logo/tokit_${image}.svg`}
            alt="Loading"
            width={size}
            height={size}
            priority
            className="h-full w-full"
          />
        </div>

        <div className={cn('pb-6 text-center whitespace-pre-line', type === 'loading' && 'animate-pulse')}>
          {text && <div className="font-display-sm text-gray-900">{text}</div>}
          {smallText && <div className="pt-2 pb-[30px] text-base font-semibold text-gray-500">{smallText}</div>}
        </div>

        {!!hasButtonLink && (
          <Link
            href={`${hasButtonLink}`}
            className="rounded-40 h-(--space-h-btn-lg) bg-stone-900 px-11 py-4 text-base font-medium text-stone-50"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * 전체 화면 로딩 스피너 (포털 기반)
 * 페이지 전환이나 중요한 데이터 로딩 시 사용
 */
export const FullScreenLoadingSpinner = ({
  text = '잠시만 기다려주세요',
  size = 160,
}: Omit<FallbackScreenProps, 'fullScreen'>) => {
  return <FallbackScreen text={text} size={size} fullScreen />;
};

/**
 * 인라인 로딩 스피너 (작은 크기)
 * 버튼 내부나 작은 섹션에서 사용
 */
export const InlineLoadingSpinner = ({ text, size = 160 }: Omit<FallbackScreenProps, 'fullScreen'>) => {
  return (
    <div className="flex items-center gap-2">
      <div className="animate-wiggle" style={{ width: size, height: size }}>
        <Image
          src="/images/logo/tokit_loading.svg"
          alt="Loading"
          width={size}
          height={size}
          priority
          className="h-full w-full"
        />
      </div>
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};
