import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { MessengerChannel } from '@prisma/client';
import type { Response } from 'express';
import { SendBulkMessageDto } from './dto/payload';
import { WebhookMetaService } from './webhook-meta.service';

@Controller('webhook-meta')
export class WebhookMetaController {
  constructor(private readonly webhookMetaService: WebhookMetaService) {}

  @Post(':channel')
  receive(@Param('channel') channel: MessengerChannel, @Body() payload: SendBulkMessageDto) {
    return this.webhookMetaService.receive(channel, payload);
  }

  @Get('facebook')
  verifyFacebook(
    @Query('hub.mode') mode: string | undefined,
    @Query('hub.verify_token') verifyToken: string | undefined,
    @Query('hub.challenge') challenge: string | undefined,
    @Res() response: Response,
  ) {
    return this.webhookMetaService.verifyFacebook(mode, verifyToken, challenge, response);
  }

  @Get(':channel')
  findAll(@Param('channel') channel: MessengerChannel) {
    return this.webhookMetaService.findAll(channel);
  }
}
