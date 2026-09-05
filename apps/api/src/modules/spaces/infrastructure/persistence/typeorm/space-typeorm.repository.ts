import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserOrmEntity } from '../../../../users/infrastructure/persistence/typeorm/user.orm-entity';
import { Space } from '../../../domain/entities/space.entity';
import { SpaceInvite } from '../../../domain/entities/space-invite.entity';
import { SpaceMember } from '../../../domain/entities/space-member.entity';
import { SpaceRepository } from '../../../domain/repositories/space.repository';
import { SpaceMapper } from './mappers/space.mapper';
import { SpaceInviteOrmEntity } from './space-invite.orm-entity';
import { SpaceMemberOrmEntity } from './space-member.orm-entity';
import { SpaceOrmEntity } from './space.orm-entity';

@Injectable()
export class SpaceTypeOrmRepository extends SpaceRepository {
  constructor(
    @InjectRepository(SpaceOrmEntity)
    private readonly spaces: Repository<SpaceOrmEntity>,
    @InjectRepository(SpaceMemberOrmEntity)
    private readonly members: Repository<SpaceMemberOrmEntity>,
    @InjectRepository(SpaceInviteOrmEntity)
    private readonly invites: Repository<SpaceInviteOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async create(space: Space): Promise<void> {
    await this.spaces.save(SpaceMapper.toPersistence(space));
  }

  async findById(id: string): Promise<Space | null> {
    const entity = await this.spaces.findOne({
      where: { id },
      relations: { members: true, invites: true },
    });

    return entity
      ? this.hydrate([entity]).then((spaces) => spaces[0] ?? null)
      : null;
  }

  async findByCode(code: string): Promise<Space | null> {
    const entity = await this.spaces.findOne({
      where: { code: code.toUpperCase() },
      relations: { members: true, invites: true },
    });

    return entity
      ? this.hydrate([entity]).then((spaces) => spaces[0] ?? null)
      : null;
  }

  async findByMember(userId: string): Promise<Space[]> {
    const memberships = await this.members.find({ where: { userId } });
    const ids = memberships.map((membership) => membership.spaceId);

    if (ids.length === 0) return [];

    const entities = await this.spaces.find({
      where: { id: In(ids) },
      relations: { members: true, invites: true },
      order: { createdAt: 'ASC' },
    });

    return this.hydrate(entities);
  }

  async existsByCode(code: string): Promise<boolean> {
    return (await this.spaces.countBy({ code })) > 0;
  }

  async rename(spaceId: string, name: string): Promise<void> {
    await this.spaces.update({ id: spaceId }, { name });
  }

  async addMember(spaceId: string, member: SpaceMember): Promise<void> {
    await this.members.save(SpaceMapper.memberToPersistence(spaceId, member));
  }

  async removeMember(spaceId: string, userId: string): Promise<void> {
    await this.members.delete({ spaceId, userId });
  }

  async addInvite(invite: SpaceInvite): Promise<void> {
    await this.invites.save(SpaceMapper.inviteToPersistence(invite));
  }

  async updateInvite(invite: SpaceInvite): Promise<void> {
    await this.invites.save(SpaceMapper.inviteToPersistence(invite));
  }

  /** Members are stored as ids; the name and e-mail come from the users table. */
  private async hydrate(entities: SpaceOrmEntity[]): Promise<Space[]> {
    const userIds = [
      ...new Set(
        entities.flatMap((entity) =>
          (entity.members ?? []).map((m) => m.userId),
        ),
      ),
    ];

    const rows =
      userIds.length > 0
        ? await this.users.find({ where: { id: In(userIds) } })
        : [];
    const names = new Map(
      rows.map((row) => [row.id, { name: row.name, email: row.email }]),
    );

    return entities.map((entity) => SpaceMapper.toDomain(entity, names));
  }
}
