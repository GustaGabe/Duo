import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(id: string, spaceId: string): Promise<void> {
    const category = await this.categories.findById(id);

    if (!category) throw new NotFoundException('Categoria não encontrada.');
    if (category.spaceId !== spaceId) {
      throw new ForbiddenException('Essa categoria é de outro espaço.');
    }

    await this.categories.delete(id);
  }
}
