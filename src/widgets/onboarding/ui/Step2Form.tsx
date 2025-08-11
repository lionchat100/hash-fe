import { useEffect } from 'react';
import { useOnboardingStore } from '../model/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Badge } from '@/shared/ui/Badge';
import { DrawerSelect } from '@/widgets/onboarding/ui/DrawerSelect';
import { Step2Data } from '../model/types';
import { step2Schema } from '../model/validators';

export const Step2Form = () => {
  //   const { data: options, isLoading } = useSelectOptions()

  const options = [
    {
      key: 'mbti',
      label: 'MBTI',
      placeholder: '자신의 MBTI를 선택해주세요',
      options: ['INFJ', 'INTJ', 'ENTJ'], //data.filter((d) => d.type === 'mbti');
    },
    {
      key: 'region',
      label: '지역',
      placeholder: '지역을 선택하세요',
      contentHeader: '희망 근무 지역',
      options: ['서울', '부산', '대구'],
    },
    {
      key: 'interest',
      label: '관심 분야',
      placeholder: '관심 분야를 선택하세요',
      contentHeader: '관심 있는 분야',
      options: ['마케팅', '개발', '디자인'],
    },
  ];

  const step2 = useOnboardingStore((s) => s.data.step2);
  const save = useOnboardingStore((s) => s.save);

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2 ?? { jobId: '', regionId: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    const sub = form.watch((value) => save('step2', value as Step2Data));
    return () => sub.unsubscribe();
  }, [form, save]);

  return (
    <form className="space-y-5 px-4">
      {options.map(({ key, label, placeholder, contentHeader, options }) => (
        <DrawerSelect
          key={key}
          label={label}
          placeholder={placeholder}
          contentHeader={contentHeader}
          value={options[key]}
          onConfirm={(val) => setState((prev) => ({ ...prev, [key]: val }))}
          renderOptions={(selected, setSelected) => (
            <div className="flex gap-2">
              {options.map((opt, i) => (
                <Badge
                  key={i}
                  className={`rounded border px-4 py-2 ${selected === opt ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelected(opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}
        />
      ))}
    </form>
  );
};
