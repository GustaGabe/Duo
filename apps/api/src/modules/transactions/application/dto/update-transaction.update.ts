import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateTransactionDto } from './create-transaction.input';

export class UpdateTransactionDto extends PartialType(
  OmitType(CreateTransactionDto, ['spaceId'] as const),
) {}
