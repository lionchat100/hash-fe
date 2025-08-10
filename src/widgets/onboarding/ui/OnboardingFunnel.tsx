import { useEffect } from 'react';
import { useOnboardingStore } from '../model/store';
import { getSchemaByStep } from '../model/validators';
import { StepRender } from './StepRender';
import { Progress } from '@/shared/ui/Progress';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
// import { useSubmitOnboarding } from '@/features/updateUser/model/useSubmitOnboarding';

export const OnboardingFunnel = ({ initialStep = 1 }: { initialStep?: number }) => {
  const { step, total, data, setStep } = useOnboardingStore();
  //   const submit = useSubmitOnboarding();
  // 초기 스텝 세팅
  useEffect(() => {
    if (initialStep > 1 && step !== initialStep) {
      setStep(initialStep);
    }
  }, [initialStep, step, setStep]);

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const goNext = async () => {
    console.log('다음');
    const schema = getSchemaByStep(step);
    const current = step === 1 ? data.step1 : step === 2 ? data.step2 : step === 3 ? data.step3 : {};
    const parsed = schema.safeParse(current);
    if (!parsed.success) {
      /* 에러 UX 처리 */ return;
    }
    if (step < total) setStep(step + 1);
    // else submit.mutate(data); // 마지막 서버 저장(features API)
  };

  //   const progress = Math.round((step / total) * 100); // 단계별 지정 예정

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
        <StepRender step={step} />
      </div>
      <div className="flex justify-center pb-2">
        <Button className="w-xs" onClick={goNext}>
          {step === total ? '저장' : '다음'}
        </Button>
      </div>
    </div>
  );
};
