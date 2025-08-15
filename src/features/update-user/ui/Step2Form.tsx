'use client';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOnboardingStore } from '@/entities/user/model/slice';
import { step2Schema } from '@/entities/user/lib/validators';
import type { Step2Data, StepFormHandle } from '@/entities/user/model/types';
import { useOptionFilter } from '../model/userOnboarding';

import { Badge } from '@/shared/ui/Badge';
import { DrawerSelect } from '@/features/update-user/ui/DrawerSelect';
import { preferenceLableMapper } from '@/entities/user/lib/onboardingDataMapper';
import { cn } from '@/shared/lib/tailwindMerge';

interface Step2FormProps {
  onValid: (values: Step2Data) => void;
}

export const Step2Form = forwardRef<StepFormHandle, Step2FormProps>(function Step2Form({ onValid }, ref) {
  // 초기값 주입
  const step2 = useOnboardingStore((s) => s.data.step2);

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2 ?? { mbti: '', position: '', preferenceType: '' },
    mode: 'onChange',
  });
  const { errors } = form.formState;

  // 다음 버튼 활성화 여부 관련
  const setCanProceed = useOnboardingStore((s) => s.setCanProceed);
  useEffect(() => {
    setCanProceed('step2', form.formState.isValid);
  }, [form.formState.isValid, setCanProceed]);

  // 부모에 submit 핸들 노출
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit((values) => onValid(values))();
    },
  }));

  // 옵션 로딩
  const { bundle, step2Configs } = useOptionFilter();

  if (!bundle || !step2Configs) {
    return <div className="px-4 py-6">옵션을 불러오지 못했어요.</div>;
  }

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {step2Configs.map(({ key, label, placeholder, items }) => {
        return (
          <div key={key} className="space-y-2">
            <Controller
              name={key}
              control={form.control}
              render={({ field }) => (
                <DrawerSelect
                  label={label}
                  placeholder={placeholder}
                  value={field.value || ''}
                  onConfirm={field.onChange}
                  renderOptions={(selected, setSelected) => (
                    <div className="flex h-[250px] flex-wrap content-start gap-2">
                      {items.map((opt) => {
                        const lableText = key === 'preferenceType' ? preferenceLableMapper(opt.name) : opt.name;
                        return (
                          <Badge
                            key={opt.code}
                            className={cn(
                              'cursor-pointer py-2.5',
                              key === 'mbti' ? 'w-[75px] text-center' : 'px-6',
                              selected === opt.name ? 'bg-primary font-bold text-stone-100' : '',
                            )}
                            onClick={() => setSelected(opt.name)}
                          >
                            {lableText}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                />
              )}
            />
            {errors[key] && <p className="text-sm text-red-500">{errors[key].message as string}</p>}
          </div>
        );
      })}
    </form>
  );
});
