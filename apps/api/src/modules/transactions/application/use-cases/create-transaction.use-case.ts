import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionInput } from '../dto/create-transaction.input';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
      throw new BadRequestException(
        'O valor precisa ser um número inteiro de centavos.',
      );
    }

    const transaction = new Transaction(
      randomUUID(),
      input.spaceId,
      input.kind,
      input.description.trim(),
      input.amountCents,
      input.categoryId,
      input.payerId,
      input.split,
      input.date,
      input.recurring,
      new Date(),
    );

    await this.transactionRepository.create(transaction);

    return transaction;
  }
}
