'use client';

import { Siren } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

export const ReportButton = () => {
  const handleReportClick = () => {
    const confirmed = window.confirm('신고하시겠습니까?');
    if (confirmed) {
      // 구글 폼으로 이동
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLScwrZktsbUG3Q2AqPYNVH4cutyaJy1pO71XKLgqDbJJOVz7yg/viewform',
        '_blank',
      );
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleReportClick} aria-label="신고하기">
      <Siren className="size-6" />
    </Button>
  );
};
