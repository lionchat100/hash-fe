import { z } from 'zod';
import { MESSAGE_MAX_LEN } from '@/shared/constants';

// 문자열 공백만 있는지 검사
const nonEmptyTrimmed = z
  .string()
  .transform((s) => s.trim())
  .refine((s) => s.length > 0, {
    message: '메시지를 입력해주세요.',
  });

export const MessageReqSchema = z.object({
  chatRoomId: z.number().int().positive(),
  content: z
    .string()
    .max(MESSAGE_MAX_LEN, `메시지가 너무 깁니다. 최대 ${MESSAGE_MAX_LEN}자까지 가능합니다.`)
    .transform((s) => s.replace(/\r\n/g, '\n'))
    .pipe(nonEmptyTrimmed),
});

export function buildMessagePayload(roomId: number, raw: string) {
  const result = MessageReqSchema.safeParse({ chatRoomId: roomId, content: raw });
  if (!result.success) {
    return { ok: false as const, error: result.error.issues[0]?.message ?? '유효하지 않은 입력' };
  }
  return { ok: true as const, value: result.data };
}
