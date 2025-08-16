export interface Post {
  title: string;
  content: string;
}

export interface CommonTypesInFeed {
  id: number;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface UserBrief {
  id: number;
  name: string;
  imageUrl?: string; // profileImageUrl 동일화
}

export interface PageInfo {
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 제네릭으로 content 타입만 바꾸기
export interface PageResponse<T> extends PageInfo {
  content: T[];
}

export interface Feed extends CommonTypesInFeed {
  title: string;
  commentCount: number;
}

export interface FeedItem {
  feed: Feed;
  writer: UserBrief;
}

export type FeedPageResponse = PageResponse<FeedItem>;

// 정렬용
export type Sort = 'latest' | 'popular';
