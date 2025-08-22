import { useEffect, useRef } from 'react';

import { StepKey, AllFormData, StepFormHandle } from '@/entities/user/model/types';
import { useOnboardingStore } from '@/entities/user/model/slice';
import { StepRender } from './StepRender';

import { PROGRESS_BY_STEP } from '@/shared/constants';
import { Progress } from '@/shared/ui/Progress';
import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';

import { useSubmitOnboarding } from '@/features/update-user/model/userOnboarding';
import { useOnboardingData } from '@/entities/user/api/getOnboardingData';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

const order: StepKey[] = ['step1', 'step2', 'step3'];

export const OnboardingFunnel = ({ initialStep = 1 }: { initialStep?: number }) => {
  const { isPending } = useOnboardingData();
  const { step, total, setStep, save } = useOnboardingStore();
  const submit = useSubmitOnboarding();

  // 버튼 활성화 여부 컨트롤
  const canProceed = useOnboardingStore((s) => s.canProceed);
  const currentKey = order[step - 1];
  const nextDisabled = !canProceed[currentKey];

  // 초기 스텝 세팅
  useEffect(() => {
    if (initialStep > 1 && step !== initialStep) {
      setStep(initialStep);
    }
  }, [initialStep, step, setStep]);

  const refs = useRef<Record<StepKey, StepFormHandle | null>>({
    step1: null,
    step2: null,
    step3: null,
  });

  // onValid 공통 팩토리 (스텝별로 재사용)
  const onValid =
    <K extends StepKey>(key: K) =>
    (values: AllFormData[K]) => {
      save(key, values); // 공통 저장
      const idx = order.indexOf(key);
      if (idx < order.length - 1) {
        setStep(idx + 2); // 1-based step 이동
      } else {
        // 마지막 스텝이면 서버 제출
        submit.mutate();
      }
    };

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };
  const goNext = () => {
    const currentKey = order[step - 1];
    refs.current[currentKey]?.submit();
  };

  const progressValue = PROGRESS_BY_STEP[step] ?? 50;

  if (isPending) return <FallbackScreen fullScreen />;

  return (
    <div className="flex h-dvh flex-col justify-between px-4">
      <div>
        <header className="safe-pt sticky top-0 z-10 flex h-(--space-h-header) items-center justify-center pt-3 pb-2.5">
          {step > 1 && (
            <Button variant="ghost" size="icon" onClick={goPrev} className="absolute left-0">
              <ChevronLeft className="size-6" />
            </Button>
          )}
          <h2 className="text-xl font-semibold text-stone-900">프로필 만들기</h2>
        </header>
        <div className="pt-2.5 pb-8">
          <Progress value={progressValue} />
        </div>
        <StepRender
          step={step}
          bind={{
            step1: { ref: (el) => (refs.current.step1 = el), onValid: onValid('step1') },
            step2: { ref: (el) => (refs.current.step2 = el), onValid: onValid('step2') },
            step3: { ref: (el) => (refs.current.step3 = el), onValid: onValid('step3') },
          }}
        />
      </div>
      <div className="flex justify-center pb-2">
        <Button className="w-xs" onClick={goNext} disabled={nextDisabled}>
          {step === total ? '저장' : '다음'}
        </Button>
      </div>
    </div>
  );
};
