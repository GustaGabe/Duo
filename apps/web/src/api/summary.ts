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

function carriedBy(transaction: Transaction, userId: string, memberCount: number): number {
  if (transaction.split === 'equal') return Math.round(transaction.amountCents / memberCount);
  return transaction.payerId === userId ? transaction.amountCents : 0;
}

function buildSettlements(expenses: Transaction[], memberIds: string[]): Settlement[] {
  if (memberIds.length < 2) return [];

  const split = expenses.filter((transaction) => transaction.split === 'equal');
  if (split.length === 0) return [];

  const share = split.reduce((total, transaction) => total + transaction.amountCents, 0) / memberIds.length;

  const balances = memberIds.map((userId) => ({
    userId,
    net:
      split
        .filter((transaction) => transaction.payerId === userId)
        .reduce((total, transaction) => total + transaction.amountCents, 0) - share,
  }));

  const creditors = balances.filter((entry) => entry.net > 0).toSorted((a, b) => b.net - a.net);
  const debtors = balances.filter((entry) => entry.net < 0).toSorted((a, b) => a.net - b.net);

  const settlements: Settlement[] = [];
  let c = 0;
  let d = 0;

  while (c < creditors.length && d < debtors.length) {
    const credit = creditors[c]!;
    const debt = debtors[d]!;
    const amount = Math.round(Math.min(credit.net, -debt.net));

    if (amount > 0) {
      settlements.push({
        fromUserId: debt.userId,
        toUserId: credit.userId,
        amountCents: amount,
        settled: false,
      });
    }

    credit.net -= amount;
    debt.net += amount;
    if (credit.net <= 0) c += 1;
    if (debt.net >= 0) d += 1;
  }

  return settlements;
}

export function getMonthSummary(
  spaceId: string,
  month: IsoMonth = CURRENT_MONTH,
): Promise<MonthSummary> {
  return mockRequest(() => {
    const space = db.spaces.find((candidate) => candidate.id === spaceId);
    if (!space) throw new Error(`Space ${spaceId} not found.`);

    const memberCount = space.members.length;
    const rows = db.transactions.filter(
      (transaction) => transaction.spaceId === spaceId && transaction.date.startsWith(month),
    );
    const expenses = rows.filter((transaction) => transaction.kind === 'expense');
    const incomes = rows.filter((transaction) => transaction.kind === 'income');

    const expenseCents = expenses.reduce((total, transaction) => total + transaction.amountCents, 0);
    const incomeCents = incomes.reduce((total, transaction) => total + transaction.amountCents, 0);

    const perPerson: PersonSummary[] = space.members.map((member) => {
      const spentCents = expenses.reduce(
        (total, transaction) => total + carriedBy(transaction, member.id, memberCount),
        0,
      );
      return {
        userId: member.id,
        spentCents,
        sharePercent: expenseCents === 0 ? 0 : (spentCents / expenseCents) * 100,
        transactionCount: expenses.filter((transaction) => transaction.payerId === member.id).length,
      };
    });

    const byCategory: CategorySummary[] = db.categories
      .filter((category) => category.spaceId === spaceId)
      .map((category) => {
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
      spaceId,
      month,
      incomeCents,
      expenseCents,
      balanceCents: incomeCents - expenseCents,
      perPerson,
      byCategory,
      settlements: buildSettlements(
        expenses,
        space.members.map((member) => member.id),
      ),
    };
  });
}
