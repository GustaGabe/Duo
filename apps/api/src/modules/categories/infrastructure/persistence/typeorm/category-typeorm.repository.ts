import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../../../domain/entities/category.entity';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryOrmEntity } from './category.orm-entity';

@Injectable()
export class CategoryTypeOrmRepository extends CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {
    super();
  }

  async create(category: Category): Promise<void> {
    await this.repository.save(CategoryMapper.toPersistence(category));
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { id } });

    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findBySpaceId(spaceId: string): Promise<Category[]> {
    const entities = await this.repository.find({
      where: { spaceId },
      order: { name: 'ASC' },
    });

    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async update(category: Category): Promise<void> {
    await this.repository.save(CategoryMapper.toPersistence(category));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
