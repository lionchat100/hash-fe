import { StompProvider } from '../_providers';
import NavShell from '@/widgets/common/NavShell';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <StompProvider>
      <NavShell>{children}</NavShell>
    </StompProvider>
  );
}
