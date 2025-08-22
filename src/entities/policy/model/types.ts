export type PolicyBlock =
  | { kind: 'pageDescription'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'p'; space?: boolean; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'space'; space: number };

export interface PolicyDoc {
  id: string;
  title: string;
  blocks: PolicyBlock[];
}
