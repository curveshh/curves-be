import { PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './create';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
