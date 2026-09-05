import { TransactionType } from '../../domain/enums/transaction-type.enum';

export interface CreateTransactionInput {
  spaceId: string;
  createdBy: string;
  categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
}

export class CreateTransactionDto implements CreateTransactionInput {
  spaceId: string;
  createdBy: string;
  categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
}
