import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { RefreshSession } from '../../../domain/entities/refresh-session.entity';
import { RefreshSessionRepository } from '../../../domain/repositories/refresh-session.repository';
import { RefreshSessionMapper } from './mappers/refresh-session.mapper';
import { RefreshSessionOrmEntity } from './refresh-session.orm-entity';

@Injectable()
export class RefreshSessionTypeOrmRepository extends RefreshSessionRepository {
  constructor(
    @InjectRepository(RefreshSessionOrmEntity)
    private readonly repository: Repository<RefreshSessionOrmEntity>,
  ) {
    super();
  }

  async create(session: RefreshSession): Promise<void> {
    await this.repository.save(RefreshSessionMapper.toPersistence(session));
  }

  async findById(id: string): Promise<RefreshSession | null> {
    const entity = await this.repository.findOne({ where: { id } });

    return entity ? RefreshSessionMapper.toDomain(entity) : null;
  }

  async update(session: RefreshSession): Promise<void> {
    await this.repository.save(RefreshSessionMapper.toPersistence(session));
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }
}
