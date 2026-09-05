import { Transaction } from '../../../../domain/entities/transaction.entity';
import { SplitMode } from '../../../../domain/enums/split-mode.enum';
import { TransactionKind } from '../../../../domain/enums/transaction-kind.enum';
import { TransactionOrmEntity } from '../transaction.orm-entity';

export class TransactionMapper {
  static toDomain(entity: TransactionOrmEntity): Transaction {
    return new Transaction(
      entity.id,
      entity.spaceId,
      entity.kind as TransactionKind,
      entity.description,
      entity.amountCents,
      entity.categoryId,
      entity.payerId,
      entity.split as SplitMode,
      new Date(`${entity.date}T00:00:00.000Z`),
      entity.recurring,
      entity.createdAt,
    );
  }

  static toPersistence(transaction: Transaction): TransactionOrmEntity {
    const entity = new TransactionOrmEntity();

    entity.id = transaction.id;
    entity.spaceId = transaction.spaceId;
    entity.kind = transaction.kind;
    entity.description = transaction.description;
    entity.amountCents = transaction.amountCents;
    entity.categoryId = transaction.categoryId;
    entity.payerId = transaction.payerId;
    entity.split = transaction.split;
    entity.date = transaction.date.toISOString().slice(0, 10);
    entity.recurring = transaction.recurring;
    entity.createdAt = transaction.createdAt;

    return entity;
  }
}
