import { MessageRes } from '@/entities/message';
import { MESSAGE_PAGE_SIZE } from '@/shared/constants';
import { QueryClient } from '@tanstack/react-query';

export function pushLiveMessage(qc: QueryClient, roomId: number, msg: MessageRes) {
  const key = ['messages', roomId] as const;

  qc.setQueryData<any>(key, (old: any) => {
    if (!old?.pages?.length) return old;

    // 이미 존재하면 무시
    for (const page of old.pages as MessageRes[][]) {
      if (page.some((m) => m.messageId === msg.messageId)) return old;
    }

    const pages = (old.pages as MessageRes[][]).map((p) => [...p]);
    const first = pages[0];

    // 최신은 앞쪽으로 삽입
    first.unshift(msg);

    // 페이지 크기 유지
    if (first.length > MESSAGE_PAGE_SIZE) {
      first.pop();
    }

    return { ...old, pages };
  });
}
