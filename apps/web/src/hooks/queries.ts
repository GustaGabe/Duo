import type { IsoMonth, TransactionQuery } from '@duo/shared';

export const queryKeys = {
  session: ['session'] as const,
  currentUser: ['me'] as const,
  spaces: ['spaces'] as const,
  space: (id: string) => ['spaces', id] as const,
  categories: (spaceId: string) => ['categories', spaceId] as const,
  transactions: (query: TransactionQuery) => ['transactions', query] as const,
  summary: (spaceId: string, month: IsoMonth) => ['summary', spaceId, month] as const,
};
