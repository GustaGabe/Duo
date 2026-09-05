import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { SpaceRepository } from '../../../spaces/domain/repositories/space.repository';
import { TransactionRepository } from '../../../transactions/domain/repositories/transaction.repository';
import {
  MonthSummary,
  buildMonthSummary,
} from '../../domain/services/month-summary-calculator';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

@Injectable()
export class GetMonthSummaryUseCase {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly categories: CategoryRepository,
    private readonly transactions: TransactionRepository,
  ) {}

  async execute(
    spaceId: string,
    month = currentMonth(),
  ): Promise<MonthSummary> {
    const space = await this.spaces.findById(spaceId);

    if (!space) throw new NotFoundException('Espaço não encontrado.');

    const [categories, transactions] = await Promise.all([
      this.categories.findBySpaceId(spaceId),
      this.transactions.findBySpace({ spaceId, month }),
    ]);

    return buildMonthSummary(
      spaceId,
      month,
      space.members,
      categories,
      transactions,
    );
  }
}
