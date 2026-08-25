import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  data: T;

  @ApiProperty({
    example: '2026-07-08T10:00:00.000Z',
  })
  timestamp: string;
}
