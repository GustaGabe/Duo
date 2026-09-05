import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { TransactionKind } from '../../../transactions/domain/enums/transaction-kind.enum';
import { Category } from '../../domain/entities/category.entity';
import { CategoryColor } from '../../domain/enums/category-color.enum';
import { CategoryScope } from '../../domain/enums/category-scope.enum';
import { CategoryRepository } from '../../domain/repositories/category.repository';

export interface CreateCategoryInput {
  spaceId: string;
  name: string;
  tag: string;
  description: string;
  kind: TransactionKind;
  color: CategoryColor;
  monthlyLimitCents: number | null;
  scope: CategoryScope;
  ownerId: string | null;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = new Category(
      randomUUID(),
      input.spaceId,
      input.name.trim(),
      input.tag.trim().toUpperCase(),
      input.description.trim(),
      input.kind,
      input.color,
      input.monthlyLimitCents,
      input.scope,
      input.scope === CategoryScope.PRIVATE ? input.ownerId : null,
    );

    await this.categories.create(category);

    return category;
  }
}
