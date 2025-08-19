import { PageResponse } from '@/shared/model/types';

export interface CommentReq {
  contents: string;
}

export interface Comment {
  id: number;
  feedId: number;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface UserBrief {
  id: number;
  nickname: string;
  imageUrl?: string; // profileImageUrl 동일화
}

export interface CommentItem extends Comment {
  feedCommentUserResponse: UserBrief;
}

export type CommentRes = PageResponse<CommentItem>;
