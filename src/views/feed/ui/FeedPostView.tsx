'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeedPostHeader } from '@/entities/feed';
import { FeedPostForm, FeedPostFormRef } from '@/features/update-feed';
import { FeedPostCancelModal } from '@/entities/feed/ui/FeedPostCancelModal';
import { PolicyCard } from '@/shared/ui/PolicyCard';

export const FeedPostView = () => {
  const router = useRouter();
  const formRef = useRef<FeedPostFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleComplete = async () => {
    if (formRef.current) {
      await formRef.current.submit();
    }
  };

  const handleFormStateChange = (isValid: boolean, isSubmitting: boolean, hasContent: boolean) => {
    setIsFormValid(isValid);
    setIsSubmitting(isSubmitting);
    setHasContent(hasContent);
  };

  const handleSuccess = (feedId: number) => {
    // 피드 작성 성공 시 피드 목록 페이지로 이동
    router.push('/feeds');
  };

  const handleCancel = () => {
    // 취소 시 피드 목록 페이지로 이동
    router.push('/feeds');
  };

  const handleBackButtonClick = () => {
    if (hasContent) {
      setShowWarningModal(true);
    } else {
      router.push('/feeds');
    }
  };

  const handleConfirmBack = () => {
    setShowWarningModal(false);
    router.push('/feeds');
  };

  const handleCancelBack = () => {
    setShowWarningModal(false);
  };

  return (
    <div className="flex h-dvh flex-col justify-between">
      <div>
        <FeedPostHeader
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onBackButtonClick={handleBackButtonClick}
        />
        <FeedPostForm
          ref={formRef}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onFormStateChange={handleFormStateChange}
        />
      </div>
      <PolicyCard />

      <FeedPostCancelModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />
    </div>
  );
};
