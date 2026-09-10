import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessengerChannel } from '@prisma/client';
import type { Response } from 'express';
import { SendBulkMessageDto } from './dto/payload';

@Injectable()
export class WebhookMetaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  verifyFacebook(
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
    response: Response,
  ) {
    const configuredToken = this.config.get<string>('messenger.facebook.verifyToken');
    if (!configuredToken) throw new BadRequestException('FACEBOOK_VERIFY_TOKEN chưa được cấu hình');
    if (mode !== 'subscribe' || !verifyToken || verifyToken !== configuredToken || !challenge) {
      throw new UnauthorizedException('Facebook webhook verification failed');
    }
    return response.status(200).send(challenge);
  }

  async receive(channel: MessengerChannel, payload: SendBulkMessageDto) {
    if (!Object.values(MessengerChannel).includes(channel)) {
      throw new BadRequestException('Kênh webhook không hợp lệ');
    }

    const webhook = await this.prisma.webhookMeta.create({
      data: {
        channel,
        payload: {
          customerIds: payload.recipientIds,
          message: payload.message,
        },
      },
    });

    return ResponseUtil.success({ id: webhook.id }, 'Đã nhận webhook');
  }

  async findAll(channel: MessengerChannel) {
    return ResponseUtil.success(
      await this.prisma.webhookMeta.findMany({
        where: { channel },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    );
  }
}
