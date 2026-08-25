import { MenuType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Chương trình tập' })
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'chuong-trinh-tap' })
  @IsString()
  @MaxLength(160)
  slug!: string;

  @ApiPropertyOptional({ enum: MenuType, default: MenuType.PAGE })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;

  @ApiPropertyOptional({ example: '/chuong-trinh-tap' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  href?: string;

  @ApiPropertyOptional({ description: 'ID menu cha; bỏ trống để tạo menu chính.' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ type: [String], description: 'Danh sách ID bài viết gắn vào menu.' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  postIds?: string[];
}
