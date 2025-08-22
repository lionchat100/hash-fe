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
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

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
      privacyConsent: false,
    },
    mode: 'onChange',
    shouldUnregister: false,
  });

  // 부모에 submit 핸들 노출
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit((values) => onValid(values))();
    },
  }));

  useEffect(() => {
    if (step1) {
      form.reset(step1, {
        keepTouched: false,
        keepDirty: false,
        keepErrors: false,
      });
      queueMicrotask(() => {
        form.trigger(['nickname', 'university', 'gender', 'privacyConsent', 'nicknameVerified']);
      });
    }
  }, [step1, form]);

  const {
    formState: { errors, touchedFields, submitCount },
  } = form;

  // 헬퍼: 해당 필드 에러를 보여줄지 결정
  const showErr = (name: keyof Step1Data) => !!errors[name] && (touchedFields[name] || submitCount > 0);
  const gender = form.watch('gender');

  const nickname = form.watch('nickname');
  const verified = form.watch('nicknameVerified');
  const verifiedNickname = form.watch('verifiedNickname');
  const isVerifiedFrozen = verified && verifiedNickname === nickname;

  // 다음 버튼 활성화 여부 관련
  const setCanProceed = useOnboardingStore((s) => s.setCanProceed);
  useEffect(() => {
    const verifiedOk = verified && verifiedNickname === nickname;
    setCanProceed('step1', form.formState.isValid && verifiedOk);
  }, [form.formState.isValid, nickname, verified, verifiedNickname, setCanProceed]);

  const saveToStore = useOnboardingStore((s) => s.save);
  useEffect(() => {
    const cur = form.getValues('nickname');
    const snap = form.getValues('verifiedNickname');
    const verifiedNow = form.getValues('nicknameVerified');

    if (verifiedNow && cur !== snap) {
      form.setValue('nicknameVerified', false, { shouldDirty: true, shouldValidate: false, shouldTouch: false });
      saveToStore('step1', { ...form.getValues() });
      // canProceed 갱신용 내부 검증만 수행
      queueMicrotask(() => form.trigger(['nickname', 'university', 'gender', 'privacyConsent', 'nicknameVerified']));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]); // nickname 변경에만 반응

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
    } catch {
      setResult({ available: false });
      setOpen(true);
    }
  };

  const handleModalConfirm = () => {
    if (result?.available) {
      const current = form.getValues('nickname');
      form.setValue('nicknameVerified', true, { shouldDirty: true, shouldValidate: false, shouldTouch: false });
      form.setValue('verifiedNickname', current, { shouldDirty: true, shouldValidate: false, shouldTouch: false });
      saveToStore('step1', { ...form.getValues(), nicknameVerified: true, verifiedNickname: current });
      // canProceed 계산만 필요하면 조용히 내부 검증만 돌려줌(문구는 게이트로 안 보임)
      queueMicrotask(() =>
        form.trigger(['nickname', 'university', 'gender', 'privacyConsent', 'nicknameVerified', 'verifiedNickname']),
      );
    }
    setOpen(false);
  };

  // 옵션 로딩
  const { bundle, uniConfig, genderOptions } = useOptionFilter();

  // 로딩/에러/미존재 가드 (지금은 bundle이 항상 있다고 가정)
  if (!bundle || !uniConfig) {
    return <FallbackScreen />;
  }

  const nickState = form.getFieldState('nickname', form.formState);
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
              maxLength={8}
              disabled={check.isPending}
            />
            <Button
              type="button"
              size="sm"
              className={cn(
                '!rounded-20 absolute right-2.5 bottom-1 z-5 border px-3 py-2 disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-500',
                isVerifiedFrozen
                  ? 'border-stone-400 bg-stone-50 text-stone-500'
                  : 'bg-primary border-primary text-stone-100',
              )}
              onClick={handleClickCheck}
              disabled={isVerifiedFrozen || check.isPending || nickState.invalid || !nickState.isDirty}
            >
              {isVerifiedFrozen ? '확인 완료' : check.isPending ? '확인 중…' : '중복 확인'}
            </Button>
          </div>
          {showErr('nickname') && <p className="text-sm text-red-500">{errors.nickname?.message as string}</p>}
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
                비공개
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
          {showErr('university') && <p className="text-sm text-red-500">{errors.university?.message as string}</p>}
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
          {showErr('gender') && <p className="text-sm text-red-500">{errors.gender?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="privacyConsent"
              checked={form.watch('privacyConsent')}
              onCheckedChange={(v) => form.setValue('privacyConsent', !!v, { shouldDirty: true, shouldValidate: true })}
            />
            <Label htmlFor="privacyConsent" className="text-sm leading-5">
              개인정보 처리 방침 동의(필수)
            </Label>
          </div>
          {showErr('privacyConsent') && (
            <p className="text-sm text-red-500">{errors.privacyConsent?.message as string}</p>
          )}
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
