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

  const handleConfirm = () => {
    if (temp) {
      onConfirm(temp);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-base">{label}</div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTitle className="hidden">{label}</DrawerTitle>
        <DrawerTrigger asChild>
          <Button variant="drawerSelect" className={cn('w-full justify-between text-base', !value && 'text-gray-500')}>
            {value || placeholder}
            <ChevronDown className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="space-y-4 p-4">
          <div className="text-lg font-medium">{contentHeader || label}</div>
          {renderOptions(temp, setTemp)}
          <Button onClick={handleConfirm} className="mt-4 w-full">
            확인
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
