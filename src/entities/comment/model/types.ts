import { PageResponse } from '@/shared/model/types';

export interface CommentReq {
  contents: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface UserBrief {
  id: number;
  name: string;
  imageUrl?: string; // profileImageUrl 동일화
}

export interface CommentItem extends Comment {
  feedCommentUserResponse: UserBrief;
}

export type CommentRes = PageResponse<CommentItem>;
