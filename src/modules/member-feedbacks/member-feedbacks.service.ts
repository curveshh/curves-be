import { PaginationDto } from '@/apps/api/common/dto/base/pagination';
import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMemberFeedbackDto } from './dto/create';

@Injectable()
export class MemberFeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMemberFeedbackDto) {
    const feedback = await this.prisma.memberFeedback.create({ data: dto });
    return ResponseUtil.success(feedback, 'Gửi cảm nhận thành công');
  }

  async findAll(dto: PaginationDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
      this.prisma.memberFeedback.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.memberFeedback.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return ResponseUtil.success(news, {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }
}
