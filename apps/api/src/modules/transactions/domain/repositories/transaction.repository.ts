import { Transaction } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findBySpaceId(spaceId: string): Promise<Transaction[]>;

  abstract update(transaction: Transaction): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
