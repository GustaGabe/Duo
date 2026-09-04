import type { TransactionQuery } from '@duo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTransaction, deleteTransaction, listTransactions } from '@/api/transactions';

import { queryKeys } from './queries';

export function useTransactions(query: TransactionQuery = {}) {
  return useQuery({
    queryKey: queryKeys.transactions(query),
    queryFn: () => listTransactions(query),
  });
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: ['transactions'] });
  void client.invalidateQueries({ queryKey: ['summary'] });
}

export function useCreateTransaction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => invalidateAll(client),
  });
}

export function useDeleteTransaction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => invalidateAll(client),
  });
}
