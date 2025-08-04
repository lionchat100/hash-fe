import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default function OnboardingEndPage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>온보딩 종료 페이지</h1>
        <div className='text-lg'>이곳에 프로필 작성 페이지 내용이 들어갑니다.</div>
        <div className='flex flex-col items-center justify-center'>
          <div className="">라이온챗에 오신 여러분 환영합니다</div>
          <div className="">완성된 프로필 카드</div>
          <div className="">확인해보세요!</div>
        </div>
        <Button>
          <Link href='/explore'>(터치 또는 자동 리디렉션)</Link>
        </Button>
      </div>
    </div>
  );
}