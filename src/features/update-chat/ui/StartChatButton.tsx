import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/tailwindMerge';
import { MessageCircleMore } from 'lucide-react';
import { useChatStartOnExplore } from '@/features/update-chat';

export const StartChatButton = ({ userId }: { userId: number }) => {
  const { startChat, isLoading } = useChatStartOnExplore();

  const handleChatClick = async () => {
    if (isLoading) return;
    await startChat(userId);
  };

  return (
    <Button
      onClick={handleChatClick}
      disabled={isLoading}
      variant="ghost"
      className={cn(
        'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
        isLoading && 'opacity-70',
      )}
      aria-label="채팅 시작"
    >
      <MessageCircleMore
        className={cn(
          'size-8 text-white transition-all duration-150 group-hover:size-10',
          isLoading && 'animate-pulse',
        )}
      />
    </Button>
  );
};
