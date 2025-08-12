import { Badge } from '@/shared/ui/Badge';
import { DrawerSelect } from '@/widgets/onboarding/ui/DrawerSelect';
import { useState } from 'react';

export const Step2 = () => {
  //   const { data: options, isLoading } = useSelectOptions()

  const [state, setState] = useState<Record<string, string | null>>({
    job: null,
    region: null,
    interest: null,
  });

  const selects = [
    {
      key: 'mbti',
      label: 'MBTI',
      placeholder: '자신의 MBTI를 선택해주세요',
      options: ['INFJ', 'INTJ', 'ENTJ'], //data.filter((d) => d.type === 'mbti');
    },
    {
      key: 'region',
      label: '지역',
      placeholder: '지역을 선택하세요',
      contentHeader: '희망 근무 지역',
      options: ['서울', '부산', '대구'],
    },
    {
      key: 'interest',
      label: '관심 분야',
      placeholder: '관심 분야를 선택하세요',
      contentHeader: '관심 있는 분야',
      options: ['마케팅', '개발', '디자인'],
    },
  ];

  return (
    <div className="space-y-5 px-4">
      {selects.map(({ key, label, placeholder, contentHeader, options }) => (
        <DrawerSelect
          key={key}
          label={label}
          placeholder={placeholder}
          contentHeader={contentHeader}
          value={state[key]}
          onConfirm={(val) => setState((prev) => ({ ...prev, [key]: val }))}
          renderOptions={(selected, setSelected) => (
            <div className="flex gap-2">
              {options.map((opt, i) => (
                <Badge
                  key={i}
                  className={`rounded border px-4 py-2 ${selected === opt ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelected(opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          )}
        />
      ))}
    </div>
    // <div className="px-4">
    //   <DrawerSelect
    //     label="직무"
    //     placeholder="직무를 선택하세요"
    //     contentHeader="관심 있는 직무를 선택해주세요"
    //     value={selectedJob}
    //     onConfirm={setSelectedJob}
    //     renderOptions={(selected, setSelected) => {
    //       // if (isLoading) {
    //       //   return (
    //       //     <div className="space-y-2">
    //       //       <Skeleton className="h-10 w-full" />
    //       //       <Skeleton className="h-10 w-full" />
    //       //       <Skeleton className="h-10 w-full" />
    //       //     </div>
    //       //   );
    //       // }

    //       if (!jobOptions || jobOptions.length === 0) {
    //         return <div>선택 가능한 직무가 없습니다.</div>;
    //       }

    //       return (
    //         <div className="flex gap-2">
    //           {jobOptions.map((job) => (
    //             <Badge
    //               key={job.id}
    //               className={`rounded border px-4 py-2 ${selected === job.name ? 'bg-gray-200' : ''}`}
    //               onClick={() => setSelected(job.name)}
    //             >
    //               {job.name}
    //             </Badge>
    //           ))}
    //         </div>
    //       );
    //     }}
    //   />
    // </div>
  );
};
