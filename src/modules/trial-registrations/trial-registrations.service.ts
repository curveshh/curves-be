import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTrialRegistrationDto } from './dto/create';

@Injectable()
export class TrialRegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrialRegistrationDto) {
    const registration = await this.prisma.trialRegistration.create({
      data: { ...dto, preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined },
    });
    return ResponseUtil.success(registration, 'Đăng ký tập thử thành công');
  }

  async findAll() {
    return ResponseUtil.success(
      await this.prisma.trialRegistration.findMany({ orderBy: { createdAt: 'desc' } }),
    );
  }
}
