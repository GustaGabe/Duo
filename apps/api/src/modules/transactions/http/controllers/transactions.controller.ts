import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { User } from '../../../users/domain/entities/user.entity';
import { CurrentUser } from '../../../auth/http/decorators/current-user.decorator';
import { CreateTransactionDto } from '../../application/dto/create-transaction.input';
import { UpdateTransactionDto } from '../../application/dto/update-transaction.update';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../../application/use-cases/delete-transaction.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';
import { ListTransactionsUseCase } from '../../application/use-cases/list-transaction.use-case';
import { UpdateTransactionUseCase } from '../../application/use-cases/update-transaction.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: User) {
    return this.createTransactionUseCase.execute({
      spaceId: dto.spaceId,
      createdBy: user.id,
      categoryId: dto.categoryId,
      type: dto.type,
      description: dto.description,
      amount: dto.amount,
      date: new Date(dto.date),
    });
  }

  @Get()
  findAll(@Query('spaceId') spaceId: string) {
    return this.listTransactionsUseCase.execute({ spaceId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getTransactionUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.updateTransactionUseCase.execute({
      id,
      categoryId: dto.categoryId,
      type: dto.type,
      description: dto.description,
      amount: dto.amount,
      date: dto.date === undefined ? undefined : new Date(dto.date),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteTransactionUseCase.execute(id);
  }
}
