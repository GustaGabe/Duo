import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { SpaceMemberGuard } from '../../../spaces/http/guards/space-member.guard';
import { GetSummaryDto } from '../../application/dto/get-summary.dto';
import { GetMonthSummaryUseCase } from '../../application/use-cases/get-month-summary.use-case';

@Controller('summary')
@UseGuards(SpaceMemberGuard)
export class SummaryController {
  constructor(private readonly getMonthSummary: GetMonthSummaryUseCase) {}

  @Get()
  get(@Query() query: GetSummaryDto) {
    return this.getMonthSummary.execute(query.spaceId, query.month);
  }
}
