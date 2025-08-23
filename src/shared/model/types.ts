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

export type DialogKind = 'delete' | 'report';

export interface DialogPreset {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}
