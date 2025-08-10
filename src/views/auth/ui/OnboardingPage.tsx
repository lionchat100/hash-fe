'use client';

import { OnboardingFunnel } from '@/widgets/onboarding/ui/OnboardingFunnel';

export const OnboardingPage = ({ initialStep = 1 }: { initialStep?: number }) => {
  return <OnboardingFunnel initialStep={initialStep} />;
};
