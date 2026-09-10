import { PaginationDto } from '@/apps/api/common/dto/base/pagination';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMemberFeedbackDto } from './dto/create';
import { MemberFeedbacksService } from './member-feedbacks.service';

@ApiTags('Member feedbacks')
@Controller('member-feedbacks')
export class MemberFeedbacksController {
  constructor(private readonly service: MemberFeedbacksService) {}

  @Post()
  create(@Body() dto: CreateMemberFeedbackDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Body() dto: PaginationDto) {
    return this.service.findAll(dto);
  }
}
