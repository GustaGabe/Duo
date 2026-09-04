import type { IsoMonth, TransactionQuery } from '@duo/shared';

export const queryKeys = {
  couple: ['couple'] as const,
  currentUser: ['couple', 'me'] as const,
  categories: ['categories'] as const,
  transactions: (query: TransactionQuery) => ['transactions', query] as const,
  summary: (month: IsoMonth) => ['summary', month] as const,
};
