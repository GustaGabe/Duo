import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryInput } from './create-category.use-case';

export type UpdateCategoryInput = Partial<Omit<CreateCategoryInput, 'spaceId'>>;

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(
    id: string,
    spaceId: string,
    patch: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.categories.findById(id);

    if (!category) throw new NotFoundException('Categoria não encontrada.');
    if (category.spaceId !== spaceId) {
      throw new ForbiddenException('Essa categoria é de outro espaço.');
    }

    if (patch.name !== undefined) category.name = patch.name.trim();
    if (patch.tag !== undefined) category.tag = patch.tag.trim().toUpperCase();
    if (patch.description !== undefined)
      category.description = patch.description.trim();
    if (patch.kind !== undefined) category.kind = patch.kind;
    if (patch.color !== undefined) category.color = patch.color;
    if (patch.monthlyLimitCents !== undefined)
      category.monthlyLimitCents = patch.monthlyLimitCents;
    if (patch.scope !== undefined) category.scope = patch.scope;

    await this.categories.update(category);

    return category;
  }
}
