import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { SplitMode } from '../../domain/enums/split-mode.enum';
import { TransactionKind } from '../../domain/enums/transaction-kind.enum';

export interface CreateTransactionInput {
  spaceId: string;
  kind: TransactionKind;
  description: string;
  amountCents: number;
  categoryId: string;
  payerId: string;
  split: SplitMode;
  date: Date;
  recurring: boolean;
}

export class CreateTransactionDto {
  @IsUUID()
  spaceId: string;

  @IsEnum(TransactionKind)
  kind: TransactionKind;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  description: string;

  @IsInt()
  @Min(1)
  amountCents: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  payerId: string;

  @IsEnum(SplitMode)
  split: SplitMode;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @IsBoolean()
  recurring?: boolean;
}
