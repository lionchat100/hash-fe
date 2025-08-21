import { Siren } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import Link from 'next/link';

export const ReportButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="https://example.com/report" target="_blank" rel="noopener noreferrer" aria-label="신고하기">
        <Siren className="size-6" />
      </Link>
    </Button>
  );
};
