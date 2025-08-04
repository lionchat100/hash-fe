import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>온보딩 페이지</h1>
        <div className='text-lg'>저는</div>
        <div className='text-lg'>분과</div>
        <div className='text-lg'>분야에 관심이 있어요!</div>
        <Button>
          <Link href='/onboarding/end'>관심사 선택 완료</Link>
        </Button>
      </div>
    </div>
  );
}
