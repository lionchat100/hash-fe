import Link from 'next/link';

type Props = {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
};
const UserCard = ({ user }: Props) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="flex items-center gap-3">유저 아바타</div>
      <div className="mt-4 flex gap-2">좋아요버튼 채팅시작</div>
    </div>
  );
};
export default UserCard;
