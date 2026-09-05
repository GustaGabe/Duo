import { Injectable } from '@nestjs/common';

import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class ListCategoriesUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  execute(spaceId: string): Promise<Category[]> {
    return this.categories.findBySpaceId(spaceId);
  }
}
