import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { SpaceMemberGuard } from '../../../spaces/http/guards/space-member.guard';
import { CreateTransactionDto } from '../../application/dto/create-transaction.input';
import { ListTransactionsDto } from '../../application/dto/list-transactions.input';
import { UpdateTransactionDto } from '../../application/dto/update-transaction.update';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../../application/use-cases/delete-transaction.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';
import { ListTransactionsUseCase } from '../../application/use-cases/list-transaction.use-case';
import { UpdateTransactionUseCase } from '../../application/use-cases/update-transaction.use-case';

@Controller('transactions')
@UseGuards(SpaceMemberGuard)
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute({
      spaceId: dto.spaceId,
      kind: dto.kind,
      description: dto.description,
      amountCents: dto.amountCents,
      categoryId: dto.categoryId,
      payerId: dto.payerId,
      split: dto.split,
      date: dto.date,
      recurring: dto.recurring ?? false,
    });
  }

  @Get()
  findAll(@Query() query: ListTransactionsDto) {
    return this.listTransactionsUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getTransactionUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.updateTransactionUseCase.execute({ id, ...dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteTransactionUseCase.execute(id);
  }
}
