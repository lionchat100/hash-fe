import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { DrawerSelect } from '@/widgets/onboarding/ui/DrawerSelect';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export const Step1 = () => {
  //   const { data: options, isLoading } = useSelectOptions()

  const data = [
    { id: '1', name: '개발', type: 'job' },
    { id: '2', name: '디자인', type: 'job' },
    { id: '3', name: '마케팅', type: 'job' },
    { id: '4', name: '기타', type: 'job' },
    { id: '4', name: '여자', type: 'gender' },
    { id: '5', name: '남자', type: 'gender' },
  ]; // Mock data for demonstration
  const jobOptions = data.filter((d) => d.type === 'job');
  const genderOptions = data.filter((d) => d.type === 'gender');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  return (
    <div className="space-y-5 px-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">이름</Label>
        <Input placeholder="이름을 입력해주세요" />
      </div>
      <div className="space-y-2">
        <Label className="text-base font-semibold">이메일</Label>
        <Input placeholder="이메일을 입력해주세요" />
      </div>
      <DrawerSelect
        label="대학"
        placeholder="선택"
        contentHeader="대학을 선택해주세요."
        value={selectedJob}
        onConfirm={setSelectedJob}
        showVisibilityToggle={true}
        visibilityValue={isPublic}
        onVisibilityChange={setIsPublic}
        renderOptions={(selected, setSelected) => {
          // if (isLoading) {
          //   return (
          //     <div className="space-y-2">
          //       <Skeleton className="h-10 w-full" />
          //       <Skeleton className="h-10 w-full" />
          //       <Skeleton className="h-10 w-full" />
          //     </div>
          //   );
          // }

          if (!jobOptions || jobOptions.length === 0) {
            return <div>선택 가능한 직무가 없습니다.</div>;
          }

          return (
            <div className="flex gap-2">
              {jobOptions.map((job) => (
                <Badge
                  key={job.id}
                  className={`rounded border px-4 py-2 ${selected === job.name ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelected(job.name)}
                >
                  {job.name}
                </Badge>
              ))}
            </div>
          );
        }}
      />
      <div className="space-y-2">
        <div className="text-base font-semibold">성별</div>
        <div className="flex gap-2">
          {genderOptions.map((gender) => (
            <Button key={gender.id} onClick={() => setSelectedGender(gender.name)} className="w-1/2">
              {gender.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
