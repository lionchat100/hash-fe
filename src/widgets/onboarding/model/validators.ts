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
export const step2Schema = z.object({ jobId: z.string().min(1), regionId: z.string().min(1) });
export const step3Schema = z.object({ intro: z.string().min(10) });

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
