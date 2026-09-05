import { TransactionKind } from '../../../../../transactions/domain/enums/transaction-kind.enum';
import { Category } from '../../../../domain/entities/category.entity';
import { CategoryColor } from '../../../../domain/enums/category-color.enum';
import { CategoryScope } from '../../../../domain/enums/category-scope.enum';
import { CategoryOrmEntity } from '../category.orm-entity';

export class CategoryMapper {
  static toDomain(entity: CategoryOrmEntity): Category {
    return new Category(
      entity.id,
      entity.spaceId,
      entity.name,
      entity.tag,
      entity.description,
      entity.kind as TransactionKind,
      entity.color as CategoryColor,
      entity.monthlyLimitCents,
      entity.scope as CategoryScope,
      entity.ownerId,
    );
  }

  static toPersistence(category: Category): CategoryOrmEntity {
    const entity = new CategoryOrmEntity();

    entity.id = category.id;
    entity.spaceId = category.spaceId;
    entity.name = category.name;
    entity.tag = category.tag;
    entity.description = category.description;
    entity.kind = category.kind;
    entity.color = category.color;
    entity.monthlyLimitCents = category.monthlyLimitCents;
    entity.scope = category.scope;
    entity.ownerId = category.ownerId;

    return entity;
  }
}
