import { TransactionType } from '../enums/transaction-type.enum';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly spaceId: string,
    public readonly createdBy: string,
    public categoryId: string,
    public type: TransactionType,
    public description: string,
    public amount: number,
    public date: Date,
  ) {}

  isExpense() {
    return this.type === TransactionType.EXPENSE;
  }

  isIncome() {
    return this.type === TransactionType.INCOME;
  }
}
