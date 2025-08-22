'use client';
import type { PolicyBlock } from '@/entities/policy/model/types';
import { cn } from '@/shared/lib/tailwindMerge';

export const PolicyBlockItem = ({ block }: { block: PolicyBlock }) => {
  if (block.kind === 'pageDescription')
    return <h2 className="text-base font-semibold whitespace-pre-line">{block.text}</h2>;
  if (block.kind === 'h2') return <h2 className="text-xs font-bold text-stone-700">{block.text}</h2>;
  if (block.kind === 'p')
    return <p className={cn('text-xs text-stone-700', block.space ? 'pl-8' : 'pl-4')}>{block.text}</p>;
  if (block.kind === 'list') {
    const Cmp = block.ordered ? 'ol' : 'ul';
    const cls = block.ordered ? 'list-decimal' : 'list-disc';
    return (
      <Cmp className={`${cls} pl-9 text-xs text-stone-700`}>
        {block.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </Cmp>
    );
  }
  if (block.kind === 'space') return <div className={`h-${block.space}`}></div>;
  return null;
};
