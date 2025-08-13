import { useEffect, useState } from 'react';

export default function OnboardingEndPage({ delayMs = 3000 }: { delayMs?: number }) {
  const [step, setStep] = useState<'splash' | 'detail'>('splash');

  useEffect(() => {
    const t = setTimeout(() => setStep('detail'), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return (
    <div>
      {step === 'splash' ? (
        <div className="flex h-dvh justify-center">
          <div className="font-display-sm text-center">
            <div>{}님</div>
            <div>
              <span className="text-primary">커피챗</span> 하실래요?
            </div>
          </div>
        </div>
      ) : (
        <div>다음</div>
      )}
    </div>
  );
}
