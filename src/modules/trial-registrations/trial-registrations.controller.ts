import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTrialRegistrationDto } from './dto/create';
import { TrialRegistrationsService } from './trial-registrations.service';

@Controller('trial-registrations')
export class TrialRegistrationsController {
  constructor(private readonly service: TrialRegistrationsService) {}

  @Post()
  create(@Body() dto: CreateTrialRegistrationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
