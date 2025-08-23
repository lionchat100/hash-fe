import { PolicyDoc } from '@/entities/policy/model/types';
import { PolicyBlockItem } from './PolicyBlock';

export const PolicyContent = ({ doc }: { doc: PolicyDoc }) => {
  return (
    <>
      {doc.blocks.map((b, i) => (
        <PolicyBlockItem key={i} block={b} />
      ))}
    </>
  );
};
