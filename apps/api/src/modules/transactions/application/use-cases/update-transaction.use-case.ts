import { Injectable, NotFoundException } from '@nestjs/common';

import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

interface UpdateTransactionInput {
  id: string;
  categoryId?: string;
  type?: TransactionType;
  description?: string;
  amount?: number;
  date?: Date;
}

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: UpdateTransactionInput) {
    const transaction = await this.transactionRepository.findById(input.id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (input.categoryId !== undefined) {
      transaction.categoryId = input.categoryId;
    }

    if (input.type !== undefined) {
      transaction.type = input.type;
    }

    if (input.description !== undefined) {
      transaction.description = input.description;
    }

    if (input.amount !== undefined) {
      transaction.amount = input.amount;
    }

    if (input.date !== undefined) {
      transaction.date = input.date;
    }

    await this.transactionRepository.update(transaction);

    return transaction;
  }
}
