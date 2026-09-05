import { Injectable, NotFoundException } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { SplitMode } from '../../domain/enums/split-mode.enum';
import { TransactionKind } from '../../domain/enums/transaction-kind.enum';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

export interface UpdateTransactionInput {
  id: string;
  kind?: TransactionKind;
  description?: string;
  amountCents?: number;
  categoryId?: string;
  payerId?: string;
  split?: SplitMode;
  date?: Date;
  recurring?: boolean;
}

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: UpdateTransactionInput): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(input.id);

    if (!transaction) {
      throw new NotFoundException('Lançamento não encontrado.');
    }

    if (input.kind !== undefined) transaction.kind = input.kind;
    if (input.description !== undefined)
      transaction.description = input.description.trim();
    if (input.amountCents !== undefined)
      transaction.amountCents = input.amountCents;
    if (input.categoryId !== undefined)
      transaction.categoryId = input.categoryId;
    if (input.payerId !== undefined) transaction.payerId = input.payerId;
    if (input.split !== undefined) transaction.split = input.split;
    if (input.date !== undefined) transaction.date = input.date;
    if (input.recurring !== undefined) transaction.recurring = input.recurring;

    await this.transactionRepository.update(transaction);

    return transaction;
  }
}
