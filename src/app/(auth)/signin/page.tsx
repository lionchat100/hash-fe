import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>OAuth Signin 페이지</h1>
        <Button>
          <Link href='/onboarding'>등록 시 자동으로 온보딩 페이지로 이동</Link>
        </Button>
      </div>
    </div>
  );
}
