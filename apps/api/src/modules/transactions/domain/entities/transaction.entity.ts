import { SplitMode } from '../enums/split-mode.enum';
import { TransactionKind } from '../enums/transaction-kind.enum';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly spaceId: string,
    public kind: TransactionKind,
    public description: string,
    public amountCents: number,
    public categoryId: string,
    public payerId: string,
    public split: SplitMode,
    public date: Date,
    public recurring: boolean,
    public readonly createdAt: Date,
  ) {}

  isExpense(): boolean {
    return this.kind === TransactionKind.EXPENSE;
  }

  isIncome(): boolean {
    return this.kind === TransactionKind.INCOME;
  }

  isShared(): boolean {
    return this.split === SplitMode.EQUAL;
  }

  /** What this member carries of the entry, in cents. */
  carriedBy(userId: string, memberCount: number): number {
    if (this.isShared()) return Math.round(this.amountCents / memberCount);
    return this.payerId === userId ? this.amountCents : 0;
  }
}
