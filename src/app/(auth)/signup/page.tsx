import { Button } from "@/shared/ui/Button"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>온보딩 - 프로필 작성 페이지</h1>
        <div className='text-lg'>이곳에 프로필 작성 페이지 내용이 들어갑니다.</div>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-lg'>프로필 이미지</div>
          <div className='text-lg'>이름</div>
          <div className='text-lg'>대학</div>
          <div className='text-lg'>이메일</div>
          <div className='text-lg'>분야</div>
          <div className='text-sm'>정보들은 마이페이지에서 수정가능해요!</div>
        </div>
        <Button>
          <Link href='/onboarding'>저장하기</Link>
        </Button>
      </div>
    </div>
  );
}