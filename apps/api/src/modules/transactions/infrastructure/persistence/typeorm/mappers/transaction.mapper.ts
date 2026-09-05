import { TransactionType } from 'src/modules/transactions/domain/enums/transaction-type.enum';
import { Transaction } from 'src/modules/transactions/domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../transaction.orm-entity';

export class TransactionMapper {
  static toDomain(entity: TransactionOrmEntity): Transaction {
    return new Transaction(
      entity.id,
      entity.spaceId,
      entity.createdBy,
      entity.categoryId,
      entity.type as TransactionType,
      entity.description,
      Number(entity.amount),
      entity.date,
    );
  }

  static toPersistence(transaction: Transaction): TransactionOrmEntity {
    const entity = new TransactionOrmEntity();

    entity.id = transaction.id;
    entity.spaceId = transaction.spaceId;
    entity.createdBy = transaction.createdBy;
    entity.categoryId = transaction.categoryId;
    entity.type = transaction.type;
    entity.description = transaction.description;
    entity.amount = transaction.amount;
    entity.date = transaction.date;

    return entity;
  }
}
