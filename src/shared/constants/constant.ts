import { DialogKind, DialogPreset } from '../model/types';

export const SERVICE_INFO = {
  NAME: 'Tokit',
  DESCRIPTION: '개발자 커피챗 플랫폼 Tokit',
};

export const PROGRESS_BY_STEP: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
};

export const MESSAGE_MAX_LEN = 300;
export const PAGE_SIZE = 20;

export const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'] as const;
export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;

export const PRESET_COPY: Record<DialogKind, DialogPreset> = {
  delete: {
    title: '삭제',
    description: `삭제하면 복구가 불가능해요.\n정말 삭제하시겠어요?`,
    confirmLabel: '삭제',
    cancelLabel: '취소',
  },
  report: {
    title: '신고',
    description: `신고하시겠어요?`,
    confirmLabel: '신고',
    cancelLabel: '취소',
  },
};
