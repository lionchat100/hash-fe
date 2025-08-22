import { Siren } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import Link from 'next/link';

export const ReportButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLScwrZktsbUG3Q2AqPYNVH4cutyaJy1pO71XKLgqDbJJOVz7yg/viewform"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="신고하기"
      >
        <Siren className="size-6" />
      </Link>
    </Button>
  );
};
