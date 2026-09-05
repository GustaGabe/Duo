import type { CreateTransactionInput, Transaction, TransactionQuery } from '@duo/shared';

import { request } from './http';

function toSearch(query: TransactionQuery): string {
  const params = new URLSearchParams({ spaceId: query.spaceId });

  if (query.month) params.set('month', query.month);
  if (query.owner && query.owner !== 'all') params.set('ownerId', query.owner);
  if (query.kind) params.set('kind', query.kind);
  if (query.categoryId) params.set('categoryId', query.categoryId);
  if (query.limit) params.set('limit', String(query.limit));

  return params.toString();
}

export function listTransactions(query: TransactionQuery): Promise<Transaction[]> {
  return request<Transaction[]>(`/transactions?${toSearch(query)}`);
}

export function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  return request<Transaction>('/transactions', { method: 'POST', body: input });
}

export function deleteTransaction(id: string, spaceId: string): Promise<void> {
  return request<void>(`/transactions/${id}?spaceId=${encodeURIComponent(spaceId)}`, {
    method: 'DELETE',
  });
}
