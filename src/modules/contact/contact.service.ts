import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateContactDto } from './dto/update';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getContact() {
    const contact = await this.prisma.contact.upsert({
      where: {
        id: 1,
      },
      create: {
        id: 1,
        hotline: '',
        zalo: '',
        facebook: '',
      },
      update: {},
    });

    return ResponseUtil.success(contact);
  }

  async updateContact(dto: UpdateContactDto) {
    const contact = await this.prisma.contact.upsert({
      where: {
        id: 1,
      },
      create: {
        id: 1,
        ...dto,
      },
      update: dto,
    });

    return ResponseUtil.success(contact);
  }
}
