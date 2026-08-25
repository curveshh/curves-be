import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion } from '@prisma/client';
import { CreatePromotionDto } from './dto/create';
import { SearchPromotionDto } from './dto/search';
import { UpdatePromotionDto } from './dto/update';

@Injectable()
export class PromotionService {
  constructor(private readonly prismaService: PrismaService) {}

  private async findOne(id: string) {
    const post = await this.prismaService.promotion.findUnique({ where: { id: Number(id) } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findAll(dto: SearchPromotionDto) {
    const promotions = await this.prismaService.$queryRaw<Promotion[]>`
      SELECT *
      FROM "Promotion"
      WHERE
        (
          ${dto.keyword} IS NULL
          OR unaccent(lower("title"))
            LIKE '%' || unaccent(lower(${dto.keyword})) || '%'
        )
      ORDER BY "updatedAt" ASC
    `;

    return ResponseUtil.success(promotions);
  }

  async create(dto: CreatePromotionDto) {
    const promotion = await this.prismaService.promotion.create({
      data: {
        badge: dto.badge,
        title: dto.title,
        discount: dto.discount,
        extra: dto.extra,
        ctaText: dto.ctaText,
        footerText: dto.footerText,
        footerLink: dto.footerLink,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        showOnHome: dto.showOnHome,
        bgType: dto.bgType,
        bgFrom: dto.badge,
        bgTo: dto.bgTo,
        imageUrl: dto.imageUrl,
      },
    });

    return ResponseUtil.success(promotion, 'Tạo mới thành công');
  }

  async update(id: string, dto: UpdatePromotionDto) {
    await this.findOne(id);

    const promotionUpdate = await this.prismaService.promotion.update({
      where: { id: Number(id) },
      data: {
        ...dto,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });

    return ResponseUtil.success(promotionUpdate, 'Cập nhật thành công');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.promotion.delete({ where: { id: Number(id) } });
    return ResponseUtil.success(id, 'Xóa thành công');
  }

  async details(id: string) {
    const promotion = await this.findOne(id);
    return ResponseUtil.success(promotion, 'Xóa thành công');
  }

  async findHome() {
    const promotion = await this.prismaService.promotion.findFirst({
      where: {
        showOnHome: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
    });

    return ResponseUtil.success(promotion);
  }
}
