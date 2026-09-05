import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class InMemoryTransactionRepository extends TransactionRepository {
  private readonly transactions = new Map<string, Transaction>();

  async create(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) ?? null;
  }

  async findBySpaceId(spaceId: string): Promise<Transaction[]> {
    return [...this.transactions.values()]
      .filter((transaction) => transaction.spaceId === spaceId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async update(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
  }

  async delete(id: string): Promise<void> {
    this.transactions.delete(id);
  }
}
