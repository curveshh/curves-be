import { IsOptional, IsString } from 'class-validator';

export class SearchPromotionDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
