'use client';
import { forwardRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnboardingStore } from '@/widgets/onboarding/model/store';
import { step1Schema } from '../model/validators';
import type { Step1Data } from '../model/types';

import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { DrawerSelect } from '@/widgets/onboarding/ui/DrawerSelect';
import { StepFormHandle } from './StepRender';
import { cn } from '@/shared/lib/tailwindMerge';

interface Step1FormProps {
  onValid: (values: Step1Data) => void;
}

export const Step1Form = forwardRef<StepFormHandle, Step1FormProps>(function Step1Form({ onValid }, ref) {
  const step1 = useOnboardingStore((s) => s.data.step1);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: step1 ?? { name: '', university: '', isPublic: false, gender: '' },
    mode: 'onSubmit',
  });

  const { data: bundle, isLoading } = useEnumOptions();
  const configs = useMemo(() => (bundle ? mapEnumToDrawerConfig(bundle) : []), [bundle]);

  const InitialData = [
    { id: '1', name: '개발', key: 'job' },
    { id: '2', name: '디자인', key: 'job' },
    { id: '3', name: '마케팅', key: 'job' },
    { id: '4', name: '기타', key: 'job' },
    { id: '5', name: '여자', key: 'gender' },
    { id: '6', name: '남자', key: 'gender' },
  ]; // Mock data for demonstration

  const jobOptions = InitialData.find((c) => c.key === 'region'); // 대학명으로 변경 예정
  const genderOptions = InitialData.filter((d) => d.key === 'gender');
  const { key, label, placeholder, contentHeader, items } = jobOptions;
  const value = form.watch(key) as string;

  const errors = form.formState.errors;

  if (isLoading) return <div className="px-4 py-6">로딩 중...</div>;

  return (
    <form className="space-y-5 px-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label className="text-base font-semibold">이름</Label>
        <Input placeholder="이름을 입력해주세요" {...form.register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
      </div>
      <DrawerSelect
        label="대학"
        placeholder="선택"
        contentHeader="대학을 선택해주세요."
        value={university}
        onConfirm={(val) => form.setValue('university', val, { shouldDirty: true, shouldValidate: true })}
        showVisibilityToggle
        visibilityValue={isPublic ?? false}
        onVisibilityChange={(val) => form.setValue('isPublic', val, { shouldDirty: true })}
        renderOptions={(selected, setSelected) => {
          // if (isLoading) {
          //   return (
          //     <div className="space-y-2">
          //       <Skeleton className="h-10 w-full" />
          //       <Skeleton className="h-10 w-full" />
          //       <Skeleton className="h-10 w-full" />
          //     </div>
          //   );
          // }

          if (!jobOptions || jobOptions.length === 0) {
            return <div>선택 가능한 직무가 없습니다.</div>;
          }

          return (
            <div className="flex gap-2">
              {jobOptions.map((job) => (
                <Badge
                  key={job.id}
                  className={`rounded border px-4 py-2 ${selected === job.name ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelected(job.name)}
                >
                  {job.name}
                </Badge>
              ))}
            </div>
          );
        }}
      />
      <div className="space-y-2">
        <div className="text-base font-semibold">성별</div>
        <div className="flex gap-2">
          {genderOptions.map((g) => (
            <Button
              key={g.id}
              type="button"
              onClick={() => form.setValue('gender', g.name, { shouldDirty: true, shouldValidate: true })}
              className={cn('w-1/2', gender === g.name ? 'bg-blue-500 text-white' : '')}
            >
              {g.name}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
});
