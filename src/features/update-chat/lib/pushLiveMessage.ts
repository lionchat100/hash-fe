import { MessageRes } from '@/entities/message';
import { QueryClient } from '@tanstack/react-query';

export function pushLiveMessage(qc: QueryClient, roomId: number, msg: MessageRes) {
  const key = ['messages', roomId] as const;
  qc.setQueryData<any>(key, (old: any) => {
    if (!old) return old;
    const pages: MessageRes[][] = Array.isArray(old.pages) ? old.pages.map((p: MessageRes[]) => [...p]) : [[]];
    for (const p of pages) {
      if (p.some((m) => m.messageId === msg.messageId)) {
        return old;
      }
    }
    if (!pages.length) pages.push([]);
    pages[0].unshift(msg);
    return { ...old, pages };
  });
}
