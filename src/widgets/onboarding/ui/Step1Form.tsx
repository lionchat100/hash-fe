'use client';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOnboardingStore } from '@/widgets/onboarding/model/store';
import { step1Schema } from '../model/validators';
import type { Step1Data } from '../model/types';
import type { StepFormHandle } from './StepRender';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Checkbox } from '@/shared/ui/Checkbox';

import { cn } from '@/shared/lib/tailwindMerge';
import { onboardingDataMapper } from '@/entities/user/lib/onboardingDataMapper';
import { useOnboardingData } from '@/entities/user/api/getOnboardingData';

interface Step1FormProps {
  onValid: (values: Step1Data) => void;
}

export const Step1Form = forwardRef<StepFormHandle, Step1FormProps>(function Step1Form({ onValid }, ref) {
  // 초기값 주입
  const step1 = useOnboardingStore((s) => s.data.step1);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: step1 ?? { nickname: '', university: '', isUniversityView: false, gender: '' },
    mode: 'onChange',
  });

  // 다음 버튼 활성화 여부 관련
  const setCanProceed = useOnboardingStore((s) => s.setCanProceed);
  useEffect(() => {
    setCanProceed('step1', form.formState.isValid);
  }, [form.formState.isValid, setCanProceed]);

  // 부모에 submit 핸들 노출
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit((values) => onValid(values))();
    },
  }));

  // 옵션 로딩
  const { data: bundle } = useOnboardingData();
  // const bundle = sampleData; // mock
  const configs = useMemo(() => (bundle ? onboardingDataMapper(bundle) : []), [bundle]);

  // 옵션 데이터 필터
  const uniConfig = useMemo(() => configs.find((c) => c.key === 'universities'), [configs]);

  const genderOptions = bundle?.genders ?? [];
  const { errors } = form.formState;
  const gender = form.watch('gender');

  // 로딩/에러/미존재 가드 (지금은 bundle이 항상 있다고 가정)
  if (!bundle || !uniConfig) {
    return <div className="px-4 py-6">옵션을 불러오지 못했어요.</div>;
  }

  return (
    <form className="space-y-5 px-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="nickname" className="text-base font-semibold">
          닉네임
        </Label>
        <Input placeholder="닉네임 (2~8자 이내, 한글,영문, 숫자만 가능)" {...form.register('nickname')} />
        {errors.nickname && <p className="text-sm text-red-500">{errors.nickname.message as string}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="university" className="text-base font-semibold">
            {uniConfig.label}
          </Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="universityPublic"
              checked={form.watch('isUniversityView')}
              onCheckedChange={(v) => form.setValue('isUniversityView', !!v, { shouldDirty: true })}
            />
            <Label htmlFor="universityPublic" className="text-sm">
              대학 정보 공개
            </Label>
          </div>
        </div>
        <Controller
          control={form.control}
          name="university"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={uniConfig.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {uniConfig.items.map((opt) => (
                  <SelectItem key={opt.code} value={opt.code}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.university?.message && <p className="text-sm text-red-500">{errors.university.message as string}</p>}
      </div>

      {/* 성별 */}
      <div className="space-y-2">
        <div className="text-base font-semibold">성별</div>
        <div className="flex gap-2">
          {genderOptions.map((g) => (
            <Button
              key={g.code}
              type="button"
              onClick={() =>
                form.setValue('gender', g.name, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={cn('w-1/2', gender === g.name ? 'bg-blue-500 text-white' : '')}
            >
              {g.name}
            </Button>
          ))}
        </div>
        {errors.gender?.message && <p className="text-sm text-red-500">{errors.gender.message as string}</p>}
      </div>
    </form>
  );
});
