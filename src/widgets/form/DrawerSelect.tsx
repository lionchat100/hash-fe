import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';

interface DrawerSelectProps<T = string> {
  label: string;
  placeholder: string;
  value: T | null;
  renderOptions: (temp: T | null, setTemp: (v: T) => void) => React.ReactNode;
  onConfirm: (value: T) => void;
}

export const DrawerSelect = <T extends string>({
  label,
  placeholder,
  value,
  renderOptions,
  onConfirm,
}: DrawerSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<T | null>(value ?? null);

  const canEdit = label === 'MBTI' || label === '자신의 커리어 영역';

  useEffect(() => {
    if (open) setTemp(value ?? null);
  }, [open, value]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setTemp(value ?? null);
  };

  const handleConfirm = () => {
    if (temp) {
      onConfirm(temp);
    }
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {label}
          {canEdit && <span className="pl-2 text-sm font-medium text-stone-400">*설정 후 변경 불가</span>}
        </h2>
      </div>
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button
            variant="drawerSelect"
            size="drawerSelect"
            className={cn('w-full justify-between text-base text-stone-800', !value && 'text-stone-800')}
          >
            {value || placeholder}
            <ChevronDown className="size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="space-y-5 px-8">
          <DrawerTitle className="sr-only">{label}</DrawerTitle>
          <DrawerDescription className="sr-only">프로필 옵션 선택</DrawerDescription>
          <div className="text-2xl font-bold text-stone-600">
            {label === 'MBTI' ? (
              <>
                자신의 <span className="text-stone-900">MBTI</span>를 선택해주세요
              </>
            ) : label === '자신의 커리어 영역' ? (
              <>
                자신의 <span className="text-stone-900">커리어 영역</span>를<br /> 선택해주세요
              </>
            ) : (
              <>
                관심있는 <span className="text-stone-900">대화 주제</span>를<br /> 선택해주세요
              </>
            )}
          </div>
          <div className="max-h-[250px] overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
            <div className="flex h-[250px] flex-wrap content-start gap-2">{renderOptions(temp, setTemp)}</div>
          </div>
          <Button onClick={handleConfirm} className="my-2 w-full">
            확인
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};
