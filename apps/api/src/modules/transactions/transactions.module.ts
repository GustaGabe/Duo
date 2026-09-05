import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from './application/use-cases/delete-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { ListTransactionsUseCase } from './application/use-cases/list-transaction.use-case';
import { UpdateTransactionUseCase } from './application/use-cases/update-transaction.use-case';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { TransactionsController } from './http/controllers/transactions.controller';
import { TransactionOrmEntity } from './infrastructure/persistence/typeorm/transaction.orm-entity';
import { TransactionTypeOrmRepository } from './infrastructure/persistence/typeorm/transaction-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
  controllers: [TransactionsController],
  providers: [
    { provide: TransactionRepository, useClass: TransactionTypeOrmRepository },
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    GetTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
})
export class TransactionsModule {}
