import { useEffect, useRef } from 'react';
import { useOnboardingStore } from '../model/store';
import { StepFormHandle, StepRender } from './StepRender';
import { Progress } from '@/shared/ui/Progress';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { StepKey, DataByStep } from '../model/types';

// import { useSubmitOnboarding } from '@/features/updateUser/model/useSubmitOnboarding';

const order: StepKey[] = ['step1', 'step2', 'step3'];

export const OnboardingFunnel = ({ initialStep = 1 }: { initialStep?: number }) => {
  const { step, total, data, setStep, save } = useOnboardingStore();
  // const submit = useSubmitOnboarding();

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
    (values: DataByStep[K]) => {
      save(key, values); // 공통 저장
      const idx = order.indexOf(key);
      if (idx < order.length - 1) {
        setStep(idx + 2); // 1-based step 이동
      } else {
        // 마지막 스텝이면 서버 제출
        // submit.mutate({ ...data, [key]: values });
      }
    };

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };
  const goNext = () => {
    const currentKey = order[step - 1];
    refs.current[currentKey]?.submit();
  };

  return (
    <div className="flex h-screen flex-col px-4">
      <div>
        <div className="h-[54px] pt-3 pb-2.5">
          {step > 1 && (
            <Button variant="ghost" size="icon" onClick={goPrev}>
              <ArrowLeft className="size-6" />
            </Button>
          )}
        </div>
        <div className="pt-5 pb-10">
          <Progress value={33} />
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
        <Button className="w-xs" onClick={goNext}>
          {step === total ? '저장' : '다음'}
        </Button>
      </div>
    </div>
  );
};
