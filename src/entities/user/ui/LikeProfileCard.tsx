import { UserProfile } from '@/entities/user';
import { Badge } from '@/shared/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface LikeProfileCardProps {
  className?: string;
  profile: UserProfile;
}

export const LikeProfileCard = (props: LikeProfileCardProps) => {
  const { profile } = props;
  return (
    <Link href={`/profile/${profile.userId}`}>
      <div className="mx-4 flex gap-4 border-b-1 py-4">
        <Image
          src={profile.imageUrls[0] ?? '/images/logo/tokit_info.svg'} // TODO: 기본 이미지 추가
          alt={profile.nickname}
          width={78}
          height={104}
          className="h-[104px] w-[78px] rounded-xl object-cover"
        />
        <div className="flex flex-col justify-between gap-1">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-stone-900">{profile.nickname}</h2>
            <p className="line-clamp-2 text-sm break-all text-stone-800">{profile.bio}</p>
          </div>

          <div className="flex gap-1">
            <Badge variant="outline" className="border-none bg-stone-200 px-[10px] py-[4px] text-xs text-stone-600">
              {profile.mbti}
            </Badge>
            <Badge variant="outline" className="border-none bg-stone-200 px-[10px] py-[4px] text-xs text-stone-600">
              {profile.position}
            </Badge>
            <Badge variant="outline" className="border-none bg-stone-200 px-[10px] py-[4px] text-xs text-stone-600">
              {profile.focusType}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};
