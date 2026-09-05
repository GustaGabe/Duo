import { Module } from '@nestjs/common';

import { CategoriesModule } from '../categories/categories.module';
import { SpacesModule } from '../spaces/spaces.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { GetMonthSummaryUseCase } from './application/use-cases/get-month-summary.use-case';
import { SummaryController } from './http/controllers/summary.controller';

@Module({
  imports: [SpacesModule, CategoriesModule, TransactionsModule],
  controllers: [SummaryController],
  providers: [GetMonthSummaryUseCase],
})
export class SummaryModule {}
