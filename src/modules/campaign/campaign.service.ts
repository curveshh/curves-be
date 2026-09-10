import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessengerChannel } from '@prisma/client';
import { CreateMessengerCampaignDto } from './dto/create';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async sendMessage(messageId: string) {
    const message = await this.prisma.messengerMessage.findUnique({
      where: {
        id: messageId,
      },
      include: {
        recipient: true,
      },
    });

    if (!message) {
      return;
    }

    try {
      await this.prisma.messengerMessage.update({
        where: {
          id: message.id,
        },
        data: {
          status: 'SENDING',
        },
      });

      const providerMessageId = await this.sendToProvider(
        message.recipient.channel,
        message.recipient.externalId,
        message.content,
      );

      await this.prisma.messengerMessage.update({
        where: {
          id: message.id,
        },
        data: {
          status: 'SENT',
          providerMessageId,
          sentAt: new Date(),
        },
      });

      await this.prisma.messengerRecipient.update({
        where: {
          id: message.recipientId,
        },
        data: {
          lastMessageAt: new Date(),
        },
      });
    } catch (error) {
      await this.prisma.messengerMessage.update({
        where: {
          id: message.id,
        },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Không thể gửi tin nhắn',
        },
      });
    }
  }

  async createCampaign(dto: CreateMessengerCampaignDto) {
    const recipients = await this.prisma.messengerRecipient.findMany({
      where: {
        id: {
          in: dto.recipientIds,
        },
        status: 'CONNECTED',
        channel: dto.channel,
      },
    });

    const campaign = await this.prisma.messengerCampaign.create({
      data: {
        name: dto.name,
        content: dto.content,
        channel: dto.channel,
        total: recipients.length,

        messages: {
          create: recipients.map((recipient) => ({
            recipientId: recipient.id,
            content: dto.content,
          })),
        },
      },
      include: {
        messages: true,
      },
    });

    return ResponseUtil.success(campaign);
  }

  async sendCampaign(campaignId: string) {
    const campaign = await this.prisma.messengerCampaign.findUnique({
      where: {
        id: campaignId,
      },
      include: {
        messages: {
          where: {
            status: 'PENDING',
          },
          include: {
            recipient: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.prisma.messengerCampaign.update({
      where: { id: campaignId },
      data: { status: 'SENDING' },
    });

    for (const message of campaign.messages) {
      await this.sendMessage(message.id);
    }

    const summary = await this.prisma.messengerMessage.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: { _all: true },
    });
    const sent = summary.find((item) => item.status === 'SENT')?._count._all ?? 0;
    const failed = summary.find((item) => item.status === 'FAILED')?._count._all ?? 0;
    await this.prisma.messengerCampaign.update({
      where: { id: campaignId },
      data: {
        sent,
        failed,
        status: failed > 0 ? 'PARTIALLY_FAILED' : 'COMPLETED',
      },
    });

    return this.getCampaign(campaignId);
  }

  async getCampaigns() {
    const campaigns = await this.prisma.messengerCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return ResponseUtil.success(campaigns);
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.messengerCampaign.findUnique({
      where: { id },
      include: { messages: { include: { recipient: { include: { customer: true } } } } },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return ResponseUtil.success(campaign);
  }

  async retryCampaign(campaignId: string) {
    const campaign = await this.prisma.messengerCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    await this.prisma.messengerMessage.updateMany({
      where: { campaignId, status: 'FAILED' },
      data: { status: 'PENDING', errorMessage: null },
    });
    return this.sendCampaign(campaignId);
  }

  private async sendToProvider(channel: MessengerChannel, recipientId: string, content: string) {
    if (channel === MessengerChannel.FACEBOOK) {
      const pageId = this.config.get<string>('messenger.facebook.pageId');
      const token = this.config.get<string>('messenger.facebook.pageAccessToken');
      if (!pageId) throw new Error('FACEBOOK_PAGE_ID chưa được cấu hình');
      if (!token) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN chưa được cấu hình');
      const version = this.config.get<string>('messenger.facebook.graphVersion') ?? 'v22.0';
      const response = await fetch(`https://graph.facebook.com/${version}/${pageId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { id: recipientId }, message: { text: content } }),
      });
      const body = (await response.json()) as { message_id?: string; error?: { message?: string } };
      if (!response.ok)
        throw new Error(body.error?.message ?? 'Facebook Messenger từ chối tin nhắn');
      return body.message_id ?? null;
    }

    const token = this.config.get<string>('messenger.zalo.oaAccessToken');
    if (!token) throw new Error('ZALO_OA_ACCESS_TOKEN chưa được cấu hình');
    const response = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
      method: 'POST',
      headers: { access_token: token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: { user_id: recipientId }, message: { text: content } }),
    });
    const body = (await response.json()) as {
      data?: { message_id?: string };
      error?: number;
      message?: string;
    };
    if (!response.ok || body.error) throw new Error(body.message ?? 'Zalo OA từ chối tin nhắn');
    return body.data?.message_id ?? null;
  }
}
