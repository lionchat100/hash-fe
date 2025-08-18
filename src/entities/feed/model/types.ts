import { PageResponse } from '@/shared/model/types';

export interface FeedReq {
  title: string;
  content: string;
}

export interface UserBrief {
  id: number;
  name: string;
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

// 정렬용
export type Sort = 'latest' | 'popular';
