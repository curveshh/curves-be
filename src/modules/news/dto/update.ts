import { PartialType } from '@nestjs/swagger';

import { CreateNewsPostDto } from './create';

export class UpdateNewsPostDto extends PartialType(CreateNewsPostDto) {}
