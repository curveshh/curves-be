import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateMessengerRecipientDto,
  SearchMessengerRecipientDto,
  UpdateMessengerRecipientDto,
} from './dto';

@Injectable()
export class MessengerRecipientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipients(query: SearchMessengerRecipientDto) {
    const recipients = await this.prisma.messengerRecipient.findMany({
      where: {
        channel: query.channel,
        status: query.status,
        ...(query.keyword
          ? {
              customer: {
                is: {
                  OR: [
                    { name: { contains: query.keyword, mode: 'insensitive' } },
                    { phone: { contains: query.keyword } },
                  ],
                },
              },
            }
          : {}),
      },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
    return ResponseUtil.success(recipients);
  }

  async create(dto: CreateMessengerRecipientDto) {
    const recipient = await this.prisma.messengerRecipient.upsert({
      where: { channel_externalId: { channel: dto.channel, externalId: dto.externalId } },
      update: { customerId: dto.customerId, status: 'CONNECTED', connectedAt: new Date() },
      create: dto,
      include: { customer: true },
    });
    return ResponseUtil.success(recipient, 'Đã lưu người nhận');
  }

  async update(id: string, dto: UpdateMessengerRecipientDto) {
    const existing = await this.prisma.messengerRecipient.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Messenger recipient not found');
    return ResponseUtil.success(
      await this.prisma.messengerRecipient.update({ where: { id }, data: dto }),
    );
  }
}
