import { PAGE_SIZE } from '@/shared/constants/constant';
import { Sort, Cursor, CursorPopular, CursorDefault } from '../model/types';

export const buildParams = (sort: Sort, cursor?: Cursor) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: Record<string, any> = { size: PAGE_SIZE };

  if (sort === 'popular') {
    const { lastLikeCount, lastId } = (cursor ?? {}) as CursorPopular;
    if (lastLikeCount != null) base.lastLikeCount = lastLikeCount;
    if (lastId != null) base.lastId = lastId;
    return base;
  }

  // latest | my
  const { lastId } = (cursor ?? {}) as CursorDefault;
  if (lastId != null) base.lastId = lastId;
  return base;
};
