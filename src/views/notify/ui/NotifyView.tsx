import { NotifyHeader } from '@/entities/notify/ui/NotifyHeader';
import { NotifyList } from '@/widgets/notify/ui/NorifyList';

export const NotifyView = () => {
  return (
    <div className="relative h-dvh">
      <NotifyHeader />
      <NotifyList />
    </div>
  );
};
