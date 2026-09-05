import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Transaction } from '../../../domain/entities/transaction.entity';
import { SplitMode } from '../../../domain/enums/split-mode.enum';
import {
  TransactionQuery,
  TransactionRepository,
} from '../../../domain/repositories/transaction.repository';
import { TransactionMapper } from './mappers/transaction.mapper';
import { TransactionOrmEntity } from './transaction.orm-entity';

@Injectable()
export class TransactionTypeOrmRepository extends TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {
    super();
  }

  async create(transaction: Transaction): Promise<void> {
    await this.repository.save(TransactionMapper.toPersistence(transaction));
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { id } });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findBySpace(query: TransactionQuery): Promise<Transaction[]> {
    const builder = this.repository
      .createQueryBuilder('t')
      .where('t.space_id = :spaceId', { spaceId: query.spaceId });

    if (query.month) {
      builder.andWhere(`to_char(t.date, 'YYYY-MM') = :month`, {
        month: query.month,
      });
    }

    if (query.kind) {
      builder.andWhere('t.kind = :kind', { kind: query.kind });
    }

    if (query.categoryId) {
      builder.andWhere('t.category_id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.ownerId) {
      builder.andWhere(
        new Brackets((where) =>
          where
            .where('t.payer_id = :ownerId', { ownerId: query.ownerId })
            .orWhere('t.split = :equal', { equal: SplitMode.EQUAL }),
        ),
      );
    }

    builder.orderBy('t.date', 'DESC').addOrderBy('t.created_at', 'DESC');

    if (query.limit) {
      builder.take(query.limit);
    }

    const entities = await builder.getMany();

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async update(transaction: Transaction): Promise<void> {
    await this.repository.save(TransactionMapper.toPersistence(transaction));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
