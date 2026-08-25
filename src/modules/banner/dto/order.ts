import { IsInt, IsOptional } from 'class-validator';

export class MoveBannerDto {
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @IsInt()
  order!: number;
}
