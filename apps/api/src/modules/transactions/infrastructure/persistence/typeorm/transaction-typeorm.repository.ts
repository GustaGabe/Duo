import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionMapper } from './mappers/transaction.mapper';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { TransactionRepository } from 'src/modules/transactions/domain/repositories/transaction.repository';
import { Transaction } from 'src/modules/transactions/domain/entities/transaction.entity';

@Injectable()
export class TransactionTypeOrmRepository extends TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {
    super();
  }

  async create(transaction: Transaction): Promise<void> {
    const entity = TransactionMapper.toPersistence(transaction);

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return TransactionMapper.toDomain(entity);
  }

  async findBySpaceId(spaceId: string): Promise<Transaction[]> {
    const entities = await this.repository.find({
      where: { spaceId },
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async update(transaction: Transaction): Promise<void> {
    const entity = TransactionMapper.toPersistence(transaction);

    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
