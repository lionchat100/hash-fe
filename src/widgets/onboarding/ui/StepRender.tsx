import { StepKey, AllFormData, StepFormHandle } from '@/entities/user/model/types';
import { Step1Form, Step2Form, Step3Form } from '@/features/update-user';

// StepRenderer가 받을 바인딩(스텝별 ref + onValid)
type BindMap = {
  [K in StepKey]: {
    ref: (instance: StepFormHandle | null) => void;
    onValid: (values: AllFormData[K]) => void;
  };
};

interface StepRenderProps {
  step: number;
  bind: BindMap;
}

export const StepRender = ({ step, bind }: StepRenderProps) => {
  switch (step) {
    case 1:
      return <Step1Form ref={bind.step1.ref} onValid={bind.step1.onValid} />;
    case 2:
      return <Step2Form ref={bind.step2.ref} onValid={bind.step2.onValid} />;
    case 3:
      return <Step3Form ref={bind.step3.ref} onValid={bind.step3.onValid} />;
    default:
      return null;
  }
};
