'use client';
import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOnboardingStore } from '@/entities/user/model/slice';
import { step3Schema } from '@/entities/user/lib/validators';
import { Step3Data, StepFormHandle } from '@/entities/user/model/types';

import { Textarea } from '@/shared/ui/Textarea';
import { Label } from '@/shared/ui/Label';
import { ImageUploader } from './ImageUploader';

interface Step3FormProps {
  onValid: (values: Step3Data) => void;
}

export const Step3Form = forwardRef<StepFormHandle, Step3FormProps>(function Step3Form({ onValid }, ref) {
  const step3 = useOnboardingStore((s) => s.data.step3);
  const setCanProceed = useOnboardingStore((s) => s.setCanProceed);

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: step3 ?? { bio: '', images: [] },
    mode: 'onChange',
  });

  // 부모가 호출할 submit
  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit((values) => onValid(values))(),
  }));

  // 진행가능 여부 store 반영
  React.useEffect(() => {
    setCanProceed('step3', form.formState.isValid);
  }, [form.formState.isValid, setCanProceed]);

  const { errors } = form.formState;

  return (
    <form className="space-y-6 px-4" onSubmit={(e) => e.preventDefault()}>
      {/* 이미지 업로더 */}
      <Controller
        name="images"
        control={form.control}
        render={({ field }) => (
          <ImageUploader
            value={field.value || []}
            onChange={(files) => {
              field.onChange(files);
              form.trigger('images');
            }}
            maxFiles={3}
            maxSizeMB={5}
          />
        )}
      />
      {errors.images?.message && <p className="text-sm text-red-500">{errors.images.message as string}</p>}
      {/* 소개 텍스트 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">저는</Label>
        <Textarea
          placeholder="예시. 데이터와 디자인을 모두 좋아하는 23살 대학생입니다. 다양한 전공의 사람들과 협업해보고 싶어요."
          {...form.register('bio')}
          rows={5}
        />
        {errors.bio?.message && <p className="text-sm text-red-500">{errors.bio.message as string}</p>}
      </div>{' '}
    </form>
  );
});
