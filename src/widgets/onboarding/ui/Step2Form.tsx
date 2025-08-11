'use client';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOnboardingStore } from '@/widgets/onboarding/model/store';
import { step2Schema } from '../model/validators';
import type { Step2Data, Step2FormKey } from '../model/types';
import type { StepFormHandle } from './StepRender';
import { onboardingDataMapper } from '@/entities/user/lib/onboardingDataMapper';
import { useOnboardingData } from '@/entities/user/api/getOnboardingData';

import { Badge } from '@/shared/ui/Badge';
import { DrawerSelect } from '@/widgets/onboarding/ui/DrawerSelect';
import { DrawerConfig } from '@/entities/user/model/types';

interface Step2FormProps {
  onValid: (values: Step2Data) => void;
}

export const Step2Form = forwardRef<StepFormHandle, Step2FormProps>(function Step2Form({ onValid }, ref) {
  // 초기값 주입
  const step2 = useOnboardingStore((s) => s.data.step2);

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2 ?? { mbti: '', position: '', preferenceType: '' },
    mode: 'onSubmit',
  });

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

  const dataKey: Step2FormKey[] = ['mbti', 'position', 'preferenceType'];

  const step2Configs = useMemo(
    () => configs.filter((c) => dataKey.includes(c.key as Step2FormKey)) as DrawerConfig<Step2FormKey>[],
    [configs],
  );

  const { errors } = form.formState;

  // if (isLoading) {
  //   return <div className="px-4 py-6">옵션을 불러오는 중…</div>;
  // }

  if (!step2Configs || !bundle) {
    return <div className="px-4 py-6 text-red-500">옵션을 불러오지 못했어요.</div>;
  }

  return (
    <form className="space-y-5 px-4" onSubmit={(e) => e.preventDefault()}>
      {step2Configs.map(({ key, label, placeholder, contentHeader, items }) => {
        return (
          <div key={key} className="space-y-2">
            <Controller
              name={key}
              control={form.control}
              render={({ field }) => (
                <DrawerSelect
                  label={label}
                  placeholder={placeholder}
                  contentHeader={contentHeader}
                  value={field.value || ''}
                  onConfirm={field.onChange}
                  renderOptions={(selected, setSelected) => (
                    <div className="flex flex-wrap gap-2">
                      {items.map((opt) => {
                        const code = typeof opt === 'string' ? opt : opt.code;
                        const name = typeof opt === 'string' ? opt : opt.name;
                        return (
                          <Badge
                            key={code}
                            className={`cursor-pointer rounded border px-4 py-2 ${
                              selected === code ? 'bg-gray-200' : ''
                            }`}
                            onClick={() => setSelected(code)}
                          >
                            {name}
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
