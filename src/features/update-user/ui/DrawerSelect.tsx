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
    // 🔧 드로워 열 때 키보드 내려 안전한 뷰포트 확보
    if (isOpen) {
      const el = document.activeElement as HTMLElement | null;
      if (el && typeof el.blur === 'function') el.blur();
    }
    setOpen(isOpen);
    if (!isOpen) setTemp(value ?? null);
  };

  const handleConfirm = () => {
    if (temp) onConfirm(temp);
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
            onClick={() => {
              // 🔧 트리거 클릭 시에도 포커스 제거(모바일 키보드 내림)
              const el = document.activeElement as HTMLElement | null;
              if (el && typeof el.blur === 'function') el.blur();
            }}
          >
            {value || placeholder}
            <ChevronDown className="size-6" />
          </Button>
        </DrawerTrigger>

        {/* 🔧 드로워 컨텐츠를 컬럼 레이아웃 + 스크롤/하단 sticky 영역으로 분리 */}
        <DrawerContent
          className={cn(
            // 상단/좌우 패딩
            'flex max-h-[90svh] min-h-[40svh] flex-col px-8 pt-6',
            // 하단 safe-area 여유 패딩(폴백까지 포함)
            'pb-[16px]',
          )}
          // 아주 보수적으로: iOS에서 overscroll로 URL 바 튀어나오는 걸 완화
          style={{
            // safe-area 지원 브라우저에서 추가로 더 확보
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
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

          {/* 🔧 옵션 영역은 남은 공간만 스크롤 */}
          <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
            <div className="max-h-[250px] overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
              <div className="flex h-[250px] flex-wrap content-start gap-2">{renderOptions(temp, setTemp)}</div>
            </div>
          </div>

          {/* 🔧 하단 액션 바를 sticky + safe-area 패딩 */}
          <div
            className="sticky bottom-0 -mx-8 border-t bg-white p-4"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
          >
            <Button onClick={handleConfirm} className="w-full">
              확인
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
