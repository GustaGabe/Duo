import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: CreateTransactionInput) {
    const transaction = new Transaction(
      crypto.randomUUID(),
      input.spaceId,
      input.createdBy,
      input.categoryId,
      input.type,
      input.description,
      input.amount,
      input.date,
    );

    await this.transactionRepository.create(transaction);
    return transaction;
  }
}
