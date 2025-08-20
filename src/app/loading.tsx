'use client';
import { FullScreenLoadingSpinner } from '@/shared/ui/LoadingSpinner';

export default function LoadingPage() {
  return <FullScreenLoadingSpinner text="페이지를 불러오는 중..." size={100} />;
}
