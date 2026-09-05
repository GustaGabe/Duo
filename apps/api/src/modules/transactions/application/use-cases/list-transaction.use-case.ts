import { Injectable } from '@nestjs/common';

import { ListTransactionsInput } from '../dto/list-transactions.input';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class ListTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: ListTransactionsInput) {
    return this.transactionRepository.findBySpaceId(input.spaceId);
  }
}
