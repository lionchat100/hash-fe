'use client';
import { FullScreenLoadingSpinner } from '@/widgets/common/FallbackScreen';

export default function LoadingPage() {
  return <FullScreenLoadingSpinner text="페이지를 불러오는 중..." size={100} />;
}
