import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';

interface DrawerSelectProps<T = string> {
  label: string; // Form label
  placeholder: string; // Button placeholder
  contentHeader?: string; // Drawer 내부 헤더
  value: T | null;
  renderOptions: (temp: T | null, setTemp: (v: T) => void) => React.ReactNode;
  onConfirm: (value: T) => void;
  showVisibilityToggle?: boolean; // 공개여부 설정 버튼
  visibilityValue?: boolean;
  onVisibilityChange?: (val: boolean) => void;
}

export const DrawerSelect = <T extends string>({
  label,
  placeholder,
  contentHeader,
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
    <div className="space-y-1">
      <div className="flex items-center gap-[14px]">
        <div className="text-base font-semibold">{label}</div>
      </div>
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTitle className="hidden">{label}</DrawerTitle>
        <DrawerTrigger asChild>
          <Button
            variant="drawerSelect"
            className={cn('w-full justify-between text-base text-stone-600', !value && 'text-stone-500')}
          >
            {value || placeholder}
            <ChevronDown className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="space-y-5 px-8">
          <div className="text-2xl font-medium">{contentHeader || label}</div>
          {renderOptions(temp, setTemp)}
          <Button onClick={handleConfirm} className="my-2 w-full">
            확인
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
