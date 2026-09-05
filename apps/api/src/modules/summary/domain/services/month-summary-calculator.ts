import { Category } from '../../../categories/domain/entities/category.entity';
import { SpaceMember } from '../../../spaces/domain/entities/space-member.entity';
import { Transaction } from '../../../transactions/domain/entities/transaction.entity';

export interface PersonSummary {
  userId: string;
  spentCents: number;
  sharePercent: number;
  transactionCount: number;
}

export interface CategorySummary {
  categoryId: string;
  spentCents: number;
  limitCents: number | null;
  usagePercent: number | null;
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  settled: boolean;
}

export interface MonthSummary {
  spaceId: string;
  month: string;
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  perPerson: PersonSummary[];
  byCategory: CategorySummary[];
  settlements: Settlement[];
}

/**
 * Who owes whom, counting only the entries marked as split. Each member's net is what they paid
 * minus their equal share; creditors are then matched against debtors largest first, which gives
 * the fewest transfers that clear every balance.
 */
export function buildSettlements(
  expenses: Transaction[],
  memberIds: string[],
): Settlement[] {
  if (memberIds.length < 2) return [];

  const split = expenses.filter((transaction) => transaction.isShared());
  if (split.length === 0) return [];

  const share =
    split.reduce((total, transaction) => total + transaction.amountCents, 0) /
    memberIds.length;

  const balances = memberIds.map((userId) => ({
    userId,
    net:
      split
        .filter((transaction) => transaction.payerId === userId)
        .reduce((total, transaction) => total + transaction.amountCents, 0) -
      share,
  }));

  const creditors = balances
    .filter((entry) => entry.net > 0)
    .toSorted((a, b) => b.net - a.net);
  const debtors = balances
    .filter((entry) => entry.net < 0)
    .toSorted((a, b) => a.net - b.net);

  const settlements: Settlement[] = [];
  let c = 0;
  let d = 0;

  while (c < creditors.length && d < debtors.length) {
    const credit = creditors[c];
    const debt = debtors[d];
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

export function buildMonthSummary(
  spaceId: string,
  month: string,
  members: SpaceMember[],
  categories: Category[],
  transactions: Transaction[],
): MonthSummary {
  const memberCount = members.length;
  const expenses = transactions.filter((transaction) =>
    transaction.isExpense(),
  );
  const incomes = transactions.filter((transaction) => transaction.isIncome());

  const expenseCents = expenses.reduce(
    (total, transaction) => total + transaction.amountCents,
    0,
  );
  const incomeCents = incomes.reduce(
    (total, transaction) => total + transaction.amountCents,
    0,
  );

  const perPerson: PersonSummary[] = members.map((member) => {
    const spentCents = expenses.reduce(
      (total, transaction) =>
        total + transaction.carriedBy(member.userId, memberCount),
      0,
    );

    return {
      userId: member.userId,
      spentCents,
      sharePercent: expenseCents === 0 ? 0 : (spentCents / expenseCents) * 100,
      transactionCount: expenses.filter(
        (transaction) => transaction.payerId === member.userId,
      ).length,
    };
  });

  const byCategory: CategorySummary[] = categories.map((category) => {
    const spentCents = transactions
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
      members.map((member) => member.userId),
    ),
  };
}
