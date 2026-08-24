import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  data: T[];

  @ApiProperty({
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  @ApiProperty({
    example: '2026-07-08T10:00:00.000Z',
  })
  timestamp: string;
}
