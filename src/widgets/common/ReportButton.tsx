'use client';

import { Siren } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useState } from 'react';

export const ReportButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleReportClick = () => {
    setShowModal(true);
  };
  const onReport = () => {
    setShowModal(false);
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScwrZktsbUG3Q2AqPYNVH4cutyaJy1pO71XKLgqDbJJOVz7yg/viewform',
      '_blank',
    );
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleReportClick} aria-label="신고하기">
        <Siren className="size-6" />
      </Button>
      <ConfirmDialog
        open={showModal}
        onOpenChange={setShowModal}
        onDelete={onReport}
        onCancel={() => setShowModal(false)}
        type="report"
      />
    </>
  );
};
