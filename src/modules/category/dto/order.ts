import { IsInt, IsOptional } from 'class-validator';

export class MoveCategoryDto {
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @IsInt()
  order!: number;
}
