import { Transaction } from '../entities/transaction.entity';
import { TransactionKind } from '../enums/transaction-kind.enum';

export interface TransactionQuery {
  spaceId: string;
  /** `YYYY-MM`. */
  month?: string;
  /** Entries this member is involved in — as payer, or through a shared split. */
  ownerId?: string;
  kind?: TransactionKind;
  categoryId?: string;
  limit?: number;
}

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findBySpace(query: TransactionQuery): Promise<Transaction[]>;

  abstract update(transaction: Transaction): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
