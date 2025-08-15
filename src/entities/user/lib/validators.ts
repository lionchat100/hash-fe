import { z } from 'zod';

const usernameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;

export const step1Schema = z.object({
  nickname: z
    .string()
    .nonempty({ message: '이름을 입력해주세요' })
    .regex(usernameRegex, { message: '사용할 수 없는 닉네임입니다' }),
  university: z.string().nonempty({ message: '대학을 선택해주세요' }),
  isUniversityView: z.boolean(),
  gender: z.string().nonempty({ message: '성별을 선택해주세요' }),
});
export const step2Schema = z.object({
  mbti: z.string().min(1),
  position: z.string().min(1),
  preferenceType: z.string().min(1),
});
export const step3Schema = z.object({
  bio: z
    .string()
    .min(5, { message: '최소 5자의 메세지를 작성해주세요.' })
    .max(30, { message: '최대 30자까지 작성 가능합니다' }),
  images: z.array(z.any()).max(3, '이미지는 최대 3장까지 가능합니다.'),
});

export const getSchemaByStep = (step: number) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    default:
      return z.object({});
  }
};
