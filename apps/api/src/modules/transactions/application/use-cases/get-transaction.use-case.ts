import { Injectable, NotFoundException } from '@nestjs/common';

import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class GetTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
