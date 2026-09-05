import { User } from '../../../../domain/entities/user.entity';
import { UserOrmEntity } from '../user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.passwordHash,
      entity.createdAt,
    );
  }

  static toPersistence(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();

    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.createdAt = user.createdAt;

    return entity;
  }
}
