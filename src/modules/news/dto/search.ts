import { PaginationDto } from '@/apps/api/common/dto/base/pagination';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchNews extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  isHome?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  badge?: string;
}
