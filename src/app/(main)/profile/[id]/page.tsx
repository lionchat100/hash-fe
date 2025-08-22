'use client';

import { useParams } from 'next/navigation';
import { OtherProfileView } from '@/views/profile';

export default function OtherProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  return <OtherProfileView userId={userId} />;
}
