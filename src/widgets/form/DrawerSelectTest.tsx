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
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button
            variant="drawerSelect"
            size="drawerSelect"
            className={cn('w-full justify-between text-base text-stone-800')}
          >
            {value || placeholder}
            <ChevronDown className="size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="space-y-5 px-8 pb-[calc(var(--safe-bottom)+8px]">
          <DrawerTitle className="sr-only">{label}</DrawerTitle>
          <DrawerDescription className="sr-only">프로필 옵션 선택</DrawerDescription>
          <div className="text-2xl font-bold text-stone-600">
            관심있는 <span className="text-stone-900">대화 주제</span>를<br /> 선택해주세요
          </div>

          <div className="flex h-[250px] flex-wrap content-start gap-2">{renderOptions(temp, setTemp)}</div>

          <div className="pb-[calc(var(--safe-bottom)+8px)]">
            <Button onClick={handleConfirm} className="w-full">
              확인
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
