import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PublicationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateNewsPostDto {
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'ID danh mục bài viết',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    example: '5 cách duy trì thói quen tập luyện',
  })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    example: '5-cach-duy-tri-thoi-quen-tap-luyen',
  })
  @IsString()
  @MaxLength(255)
  slug!: string;

  @ApiProperty({
    example: 'Một số cách đơn giản để duy trì thói quen tập luyện mỗi ngày.',
  })
  @IsString()
  excerpt!: string;

  @ApiProperty({
    example: '<p>Nội dung bài viết</p>',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: 'https://cdn.example.com/news/cover.jpg',
  })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiPropertyOptional({
    enum: PublicationStatus,
    default: PublicationStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @ApiPropertyOptional({
    example: '2026-08-20T08:00:00.000Z',
    description: 'Thời gian xuất bản bài viết',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({
    example: '5 cách duy trì thói quen tập luyện',
    description: 'SEO title',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional({
    example: 'Khám phá 5 cách đơn giản giúp bạn duy trì thói quen tập luyện...',
    description: 'SEO description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isHome!: boolean;
}
