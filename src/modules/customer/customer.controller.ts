import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessengerChannel } from '@prisma/client';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get(':channel')
  findAll(
    @Param('channel', new ParseEnumPipe(MessengerChannel))
    channel: MessengerChannel,
  ) {
    return this.customerService.findAll(channel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
