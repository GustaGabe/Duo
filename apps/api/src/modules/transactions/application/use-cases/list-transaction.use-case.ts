import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import {
  TransactionQuery,
  TransactionRepository,
} from '../../domain/repositories/transaction.repository';

@Injectable()
export class ListTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(query: TransactionQuery): Promise<Transaction[]> {
    return this.transactionRepository.findBySpace(query);
  }
}
