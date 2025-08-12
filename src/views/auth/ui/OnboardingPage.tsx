'use client';
import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/Progress';
import { Step1 } from '@/widgets/onboarding/ui/Step1';
import { Step2 } from '@/widgets/onboarding/ui/Step2';
import { ArrowLeft } from 'lucide-react';

export const OnboardingPage = () => {
  return (
    <div>
      <div className="flex h-screen flex-col justify-center">
        <header className="border-b border-gray-400 pt-3 pb-2.5">
          <ArrowLeft className="size-6 cursor-pointer hover:bg-amber-100" onClick={() => alert('Go Back')} />
        </header>
        <div className="pt-5 pb-10">
          <Progress value={33} />
        </div>
        <Step1 />
        <Step2 />
        <Button className="w-full" onClick={() => alert('Next Step')}>
          확인
        </Button>
      </div>
    </div>
  );
};
