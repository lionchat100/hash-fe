import { z } from 'zod';
export const step1Schema = z.object({
  name: z.string().nonempty({ message: '이름을 입력해주세요' }),
  university: z.string().nonempty({ message: '대학을 선택해주세요' }),
  gender: z.string().nonempty({ message: '성별을 선택해주세요' }),
  isPublic: z.boolean(),
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
