import { StepKey, DataByStep } from '../model/types';
import { Step1Form } from './Step1Form';
import { Step2Form } from './Step2Form';
// import { Step3Form } from './Step3Form';

export type StepFormHandle = { submit: () => void };

// StepRenderer가 받을 바인딩(스텝별 ref + onValid)
type BindMap = {
  [K in StepKey]: {
    ref: (instance: StepFormHandle | null) => void;
    onValid: (values: DataByStep[K]) => void;
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
    // case 3:
    //   return <Step3Form />;
    default:
      return null;
  }
};
