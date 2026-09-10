import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MessengerChannel } from '@prisma/client';
import { CreateCustomerDto } from './dto/create';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return ResponseUtil.success(
      await this.prisma.customer.create({ data: dto }),
      'Tạo khách hàng thành công',
    );
  }

  async findAll(channel: MessengerChannel) {
    return ResponseUtil.success(
      await this.prisma.customer.findMany({
        where: {
          type: channel,
        },

        include: {
          messengerRecipients: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      }),
    );
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { messengerRecipients: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return ResponseUtil.success(customer);
  }

  async update(id: string, dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return ResponseUtil.success(
      await this.prisma.customer.update({ where: { id }, data: dto }),
      'Cập nhật khách hàng thành công',
    );
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    await this.prisma.customer.delete({ where: { id } });
    return ResponseUtil.success(null, 'Xóa khách hàng thành công');
  }
}
