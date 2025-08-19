import clsx from 'clsx';

interface FeedPolicyCardProps {
  className?: string;
}

export const FeedPolicyCard = (props: FeedPolicyCardProps) => {
  return (
    <div className={clsx('rounded-lg bg-white p-4 shadow-md', props.className)}>
      <div className="flex items-center">
        <div className="size-10 rounded-full bg-gray-200">정책 사항</div>
        <div className="flex flex-col">
          <div>당신은 변호사를 선임할 수 있습니다.</div>
          <div>당신의 발언은 법정에서 불리하게 작용할 수 있으며 어쩌구 저쩌구</div>
        </div>
      </div>
    </div>
  );
};
