'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOnboardingStore } from '@/entities/user/model/slice';
import { step1Schema } from '@/entities/user/lib/validators';
import type { NicknameCheckRes, Step1Data, StepFormHandle } from '@/entities/user/model/types';
import { useOptionFilter } from '../model/userOnboarding';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Checkbox } from '@/shared/ui/Checkbox';

import { cn } from '@/shared/lib/tailwindMerge';
import { useCheckNickname } from '../model/userNicknameCheck';
import { CheckConfirmDialog } from './CheckConfirmDialog';

interface Step1FormProps {
  onValid: (values: Step1Data) => void;
}

export const Step1Form = forwardRef<StepFormHandle, Step1FormProps>(function Step1Form({ onValid }, ref) {
  // 초기값 주입
  const step1 = useOnboardingStore((s) => s.data.step1);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: step1 ?? {
      nickname: '',
      university: '',
      isUniversityView: false,
      gender: '',
      nicknameVerified: false,
    },
    mode: 'onChange',
  });

  // 다음 버튼 활성화 여부 관련
  const setCanProceed = useOnboardingStore((s) => s.setCanProceed);
  useEffect(() => {
    setCanProceed('step1', form.formState.isValid && !!form.watch('nicknameVerified'));
  }, [form.formState.isValid, form, setCanProceed]);

  // 부모에 submit 핸들 노출
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit((values) => onValid(values))();
    },
  }));
  const { errors } = form.formState;
  const gender = form.watch('gender');
  const nickname = form.watch('nickname');
  const verified = form.watch('nicknameVerified');

  useEffect(() => {
    // 닉네임이 바뀌면 중복확인 상태 리셋
    if (form.getValues('nicknameVerified')) {
      form.setValue('nicknameVerified', false, { shouldDirty: true, shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  const check = useCheckNickname();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<NicknameCheckRes>({ available: false });

  const handleClickCheck = async () => {
    const name = form.getValues('nickname').trim();
    if (!name) {
      form.trigger('nickname');
      return;
    }
    try {
      const res = await check.mutateAsync(name);
      setResult(res);
      setOpen(true);
    } catch (e) {
      setResult({ available: false });
      setOpen(true);
    }
  };

  const handleModalConfirm = () => {
    if (result?.available) {
      form.setValue('nicknameVerified', true, { shouldDirty: true, shouldValidate: true });
    }
    setOpen(false);
  };

  // 옵션 로딩
  const { bundle, uniConfig, genderOptions } = useOptionFilter();

  // 로딩/에러/미존재 가드 (지금은 bundle이 항상 있다고 가정)
  if (!bundle || !uniConfig) {
    return <div className="px-4 py-6">옵션을 불러오지 못했어요.</div>;
  }

  return (
    <>
      <form className="space-y-9" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="nickname" className="font-stone-900 text-base font-semibold">
            닉네임
            <span className="text-sm font-medium text-stone-400">*설정 후 변경 불가</span>
          </Label>
          <div className="relative">
            <Input
              placeholder="2~8자 이내, 한글,영문, 숫자만 가능"
              {...form.register('nickname')}
              disabled={check.isPending}
            />
            <Button
              type="button"
              size="sm"
              className={cn(
                '!rounded-20 absolute right-2.5 bottom-1 z-5 border px-3 py-2 disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-500',
                verified ? 'border-stone-400 bg-stone-50 text-stone-500' : 'bg-primary border-primary text-stone-100',
              )}
              onClick={handleClickCheck}
              disabled={verified || check.isPending || !nickname}
            >
              {verified ? '확인 완료' : check.isPending ? '확인 중…' : '중복 확인'}
            </Button>
          </div>
          {errors.nickname && <p className="text-sm text-red-500">{errors.nickname.message as string}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="university" className="font-stone-900 text-base font-semibold">
              {uniConfig.label}
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="universityPublic"
                checked={form.watch('isUniversityView')}
                onCheckedChange={(v) => form.setValue('isUniversityView', !!v, { shouldDirty: true })}
              />
              <Label htmlFor="universityPublic" className="text-sm">
                소속 정보 공개
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
                    <SelectItem key={opt.code} value={opt.name}>
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
          <div className="font-stone-900 text-base font-semibold">성별</div>
          <div className="flex gap-2">
            {genderOptions.map((g) => (
              <Button
                key={g.code}
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue('gender', g.name, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={cn(
                  'w-1/2',
                  gender === g.name
                    ? 'bg-primary text-stone-100'
                    : 'hover:bg-primary/30 text-stone-500 hover:text-stone-50',
                )}
              >
                {g.name}
              </Button>
            ))}
          </div>
          {errors.gender?.message && <p className="text-sm text-red-500">{errors.gender.message as string}</p>}
        </div>
      </form>
      <CheckConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleModalConfirm}
        available={!!result.available}
      />
    </>
  );
});
