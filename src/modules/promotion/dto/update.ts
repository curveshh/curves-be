import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreatePromotionDto } from './create';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @IsNumber()
  id!: number;
}
