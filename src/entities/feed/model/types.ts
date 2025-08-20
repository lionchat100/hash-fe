import { PageResponse } from '@/shared/model/types';

export interface FeedReq {
  title: string;
  content: string;
}

export interface UserBrief {
  id: number;
  nickname: string;
  imageUrl?: string; // profileImageUrl 동일화
}

export interface Feed {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
}

export interface FeedItem {
  feed: Feed;
  writer: UserBrief;
}

export type FeedRes = PageResponse<FeedItem>;

// 정렬, 필터용
export type Sort = 'latest' | 'popular' | 'my';

export interface CursorDefault {
  lastId?: number | null;
}
export interface CursorPopular {
  lastLikeCount?: number | null;
  lastId?: number | null;
}
export type Cursor = CursorDefault | CursorPopular;
