import type {
  CategorySummary,
  IsoMonth,
  MonthSummary,
  PersonSummary,
  Settlement,
  Transaction,
} from '@duo/shared';

import { CURRENT_MONTH, db } from './mock-db';
import { mockRequest } from './client';

function carriedBy(transaction: Transaction, userId: string): number {
  if (transaction.split === 'equal') return Math.round(transaction.amountCents / 2);
  return transaction.payerId === userId ? transaction.amountCents : 0;
}

function buildSettlement(expenses: Transaction[], memberIds: string[]): Settlement | null {
  const [first, second] = memberIds;
  if (!first || !second) return null;

  const split = expenses.filter((transaction) => transaction.split === 'equal');
  if (split.length === 0) return null;

  const paidByFirst = split
    .filter((transaction) => transaction.payerId === first)
    .reduce((total, transaction) => total + transaction.amountCents, 0);
  const totalSplit = split.reduce((total, transaction) => total + transaction.amountCents, 0);
  const credit = paidByFirst - Math.round(totalSplit / 2);

  if (credit === 0) return null;
  return credit > 0
    ? { fromUserId: second, toUserId: first, amountCents: credit, settled: false }
    : { fromUserId: first, toUserId: second, amountCents: -credit, settled: false };
}

export function getMonthSummary(month: IsoMonth = CURRENT_MONTH): Promise<MonthSummary> {
  return mockRequest(() => {
    const rows = db.transactions.filter((transaction) => transaction.date.startsWith(month));
    const expenses = rows.filter((transaction) => transaction.kind === 'expense');
    const incomes = rows.filter((transaction) => transaction.kind === 'income');

    const expenseCents = expenses.reduce((total, transaction) => total + transaction.amountCents, 0);
    const incomeCents = incomes.reduce((total, transaction) => total + transaction.amountCents, 0);

    const perPerson: PersonSummary[] = db.couple.members.map((member) => {
      const spentCents = expenses.reduce((total, transaction) => total + carriedBy(transaction, member.id), 0);
      return {
        userId: member.id,
        spentCents,
        sharePercent: expenseCents === 0 ? 0 : (spentCents / expenseCents) * 100,
        transactionCount: expenses.filter((transaction) => transaction.payerId === member.id).length,
      };
    });

    const byCategory: CategorySummary[] = db.categories.map((category) => {
      const spentCents = rows
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((total, transaction) => total + transaction.amountCents, 0);
      return {
        categoryId: category.id,
        spentCents,
        limitCents: category.monthlyLimitCents,
        usagePercent: category.monthlyLimitCents
          ? (spentCents / category.monthlyLimitCents) * 100
          : null,
      };
    });

    return {
      month,
      incomeCents,
      expenseCents,
      balanceCents: incomeCents - expenseCents,
      perPerson,
      byCategory,
      settlement: buildSettlement(
        expenses,
        db.couple.members.map((member) => member.id),
      ),
    };
  });
}
