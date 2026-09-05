import { RefreshSession } from '../../../../domain/entities/refresh-session.entity';
import { RefreshSessionOrmEntity } from '../refresh-session.orm-entity';

export class RefreshSessionMapper {
  static toDomain(entity: RefreshSessionOrmEntity): RefreshSession {
    return new RefreshSession(
      entity.id,
      entity.userId,
      entity.tokenHash,
      entity.expiresAt,
      entity.createdAt,
      entity.revokedAt,
    );
  }

  static toPersistence(session: RefreshSession): RefreshSessionOrmEntity {
    const entity = new RefreshSessionOrmEntity();

    entity.id = session.id;
    entity.userId = session.userId;
    entity.tokenHash = session.tokenHash;
    entity.expiresAt = session.expiresAt;
    entity.createdAt = session.createdAt;
    entity.revokedAt = session.revokedAt;

    return entity;
  }
}
