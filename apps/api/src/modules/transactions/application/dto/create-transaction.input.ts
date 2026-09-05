import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { TransactionType } from '../../domain/enums/transaction-type.enum';

export interface CreateTransactionInput {
  spaceId: string;
  createdBy: string;
  categoryId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
}

export class CreateTransactionDto implements Omit<
  CreateTransactionInput,
  'createdBy'
> {
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  description: string;

  @IsInt()
  @Min(1)
  amount: number;

  @Type(() => Date)
  @IsDate()
  date: Date;
}
