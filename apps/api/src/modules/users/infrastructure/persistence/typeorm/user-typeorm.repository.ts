import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserTypeOrmRepository extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async create(user: User): Promise<void> {
    await this.repository.save(UserMapper.toPersistence(user));
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(user: User): Promise<void> {
    await this.repository.save(UserMapper.toPersistence(user));
  }
}
