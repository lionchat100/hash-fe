import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>LIONCHAT</h1>
        <Button>
          <Link href='/signin'>카카오톡으로 시작하기</Link>
        </Button>
        <div className="">셋업 컴포넌트 구성하여 초기 서비스 랜딩 시 init</div>
        <div className="">초기 서비스 랜딩 시 쿼리 클라이언트 연결 확인</div>
        <div className="">초기 서비스 랜딩 시 테마 프로바이더 연결 확인</div>
        <div className="">초기 서비스 랜딩 시 소켓 프로바이더 연결 확인</div>
        <div className="">초기 서비스 랜딩 시 소켓 프로바이더 연결 확인</div>
        <div className="">사용자가 토큰 소유 시 explore 페이지로 이동</div>
      </div>
    </div>
  );
}
