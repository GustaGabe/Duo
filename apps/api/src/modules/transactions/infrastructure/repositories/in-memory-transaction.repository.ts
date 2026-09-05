import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class InMemoryTransactionRepository extends TransactionRepository {
  private readonly transactions = new Map<string, Transaction>();

  create(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
    return Promise.resolve();
  }

  findById(id: string): Promise<Transaction | null> {
    return Promise.resolve(this.transactions.get(id) ?? null);
  }

  findBySpaceId(spaceId: string): Promise<Transaction[]> {
    return Promise.resolve(
      [...this.transactions.values()]
        .filter((transaction) => transaction.spaceId === spaceId)
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    );
  }

  update(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.transactions.delete(id);
    return Promise.resolve();
  }
}
