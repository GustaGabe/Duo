import { RefreshSession } from '../entities/refresh-session.entity';

export abstract class RefreshSessionRepository {
  abstract create(session: RefreshSession): Promise<void>;

  abstract findById(id: string): Promise<RefreshSession | null>;

  abstract update(session: RefreshSession): Promise<void>;

  abstract revokeAllForUser(userId: string): Promise<void>;
}
