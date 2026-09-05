import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class GetSummaryDto {
  @IsUUID()
  spaceId: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month deve estar no formato YYYY-MM.' })
  month?: string;
}
