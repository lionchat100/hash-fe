import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';
import { useState } from 'react';
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
  showVisibilityToggle = false,
  visibilityValue,
  onVisibilityChange,
}: DrawerSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<T | null>(value ?? null);

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
        {showVisibilityToggle && onVisibilityChange && typeof visibilityValue === 'boolean' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="visibility"
              checked={visibilityValue}
              onChange={(e) => onVisibilityChange(e.target.checked)}
            />
            <label htmlFor="visibility" className="text-sm">
              대학 정보 공개
            </label>
          </div>
        )}
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTitle className="hidden">{label}</DrawerTitle>
        <DrawerTrigger asChild>
          <Button variant="drawerSelect" className={cn('w-full justify-between text-base', !value && 'text-gray-500')}>
            {value || placeholder}
            <ChevronDown className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="space-y-2 p-4">
          <div className="pb-[14px] text-2xl font-medium">{contentHeader || label}</div>
          {renderOptions(temp, setTemp)}
          <Button onClick={handleConfirm} className="mt-4 w-full">
            확인
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
