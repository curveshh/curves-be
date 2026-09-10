import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MessengerRecipientsService } from './messenger-recipients.service';
import {
  CreateMessengerRecipientDto,
  SearchMessengerRecipientDto,
  UpdateMessengerRecipientDto,
} from './dto';

@Controller('messenger-recipients')
export class MessengerRecipientsController {
  constructor(private readonly messengerService: MessengerRecipientsService) {}

  @Get()
  getRecipients(@Query() query: SearchMessengerRecipientDto) {
    return this.messengerService.getRecipients(query);
  }

  @Post()
  create(@Body() dto: CreateMessengerRecipientDto) {
    return this.messengerService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMessengerRecipientDto) {
    return this.messengerService.update(id, dto);
  }
}
