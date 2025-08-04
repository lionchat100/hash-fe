import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default function ChatsPage() {
  return (
    <div>
      <h1>Chats Page</h1>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">채팅 페이지</h1>
        <div className="text-lg">이곳에 채팅 페이지 내용이 들어갑니다.</div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-lg">
            <Button>
              <Link href='/chats/1'>채팅방 1</Link>
            </Button>
          </div>
          <div className="text-lg">
            <Button>
              <Link href='/chats/2'>채팅방 2</Link>
            </Button>
          </div>
          <div className="text-lg">
            <Button>
              <Link href='/chats/3'>채팅방 3</Link>
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
