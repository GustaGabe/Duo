import type { CreateTransactionInput, Transaction, TransactionQuery } from '@duo/shared';

import { CURRENT_MONTH, db, nextId } from './mock-db';
import { mockRequest } from './client';

function matches(transaction: Transaction, query: TransactionQuery): boolean {
  if (transaction.spaceId !== query.spaceId) return false;
  const month = query.month ?? CURRENT_MONTH;
  if (!transaction.date.startsWith(month)) return false;
  if (query.kind && transaction.kind !== query.kind) return false;
  if (query.categoryId && transaction.categoryId !== query.categoryId) return false;
  if (query.owner && query.owner !== 'all') {
    const involved = transaction.payerId === query.owner || transaction.split === 'equal';
    if (!involved) return false;
  }
  return true;
}

function byDateDesc(a: Transaction, b: Transaction): number {
  return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
}

export function listTransactions(query: TransactionQuery): Promise<Transaction[]> {
  return mockRequest(() => {
    const rows = db.transactions
      .filter((transaction) => matches(transaction, query))
      .toSorted(byDateDesc);
    return query.limit ? rows.slice(0, query.limit) : rows;
  });
}

export function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  return mockRequest(() => {
    const transaction: Transaction = {
      ...input,
      id: nextId('txn'),
      createdAt: new Date().toISOString(),
    };
    db.transactions = [transaction, ...db.transactions];
    return transaction;
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return mockRequest(() => {
    db.transactions = db.transactions.filter((transaction) => transaction.id !== id);
  });
}
