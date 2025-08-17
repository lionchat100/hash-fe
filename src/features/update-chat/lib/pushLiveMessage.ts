import { MessageRes } from '@/entities/message';
import { MESSAGE_PAGE_SIZE } from '@/shared/constants';
import { QueryClient } from '@tanstack/react-query';

export function pushLiveMessage(qc: QueryClient, roomId: number, msg: MessageRes) {
  const key = ['messages', roomId] as const;
  qc.setQueryData<any>(key, (old: any) => {
    if (!old) return old;
    const pages: MessageRes[][] = Array.isArray(old.pages) ? old.pages.map((p: MessageRes[]) => [...p]) : [[]];
    const pageParams = Array.isArray(old.pageParams) ? [...old.pageParams] : [];
    for (const p of pages) {
      if (p.some((m) => m.messageId === msg.messageId)) {
        return old;
      }
    }
    if (!pages.length) pages.push([]);
    pages[0].unshift(msg);
    let i = 0;
    while (i < pages.length) {
      if (pages[i].length <= MESSAGE_PAGE_SIZE) break;
      const overflow = pages[i].splice(MESSAGE_PAGE_SIZE);
      if (pages[i + 1]) {
        pages[i + 1] = [...overflow, ...pages[i + 1]];
      } else {
        pages[i + 1] = overflow;
        pageParams[i + 1] = pageParams.length ? pageParams[pageParams.length - 1] : null;
      }
      i++;
    }
    return { ...old, pages, pageParams };
  });
}
