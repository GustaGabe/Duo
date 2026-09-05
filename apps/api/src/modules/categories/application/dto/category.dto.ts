import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

import { TransactionKind } from '../../../transactions/domain/enums/transaction-kind.enum';
import { CategoryColor } from '../../domain/enums/category-color.enum';
import { CategoryScope } from '../../domain/enums/category-scope.enum';

export class CreateCategoryDto {
  @IsUUID()
  spaceId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsString()
  @Length(1, 2)
  tag: string;

  @IsString()
  @MaxLength(80)
  description: string;

  @IsEnum(TransactionKind)
  kind: TransactionKind;

  @IsEnum(CategoryColor)
  color: CategoryColor;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  monthlyLimitCents?: number | null;

  @IsEnum(CategoryScope)
  scope: CategoryScope;
}

export class ListCategoriesDto {
  @IsUUID()
  spaceId: string;
}
