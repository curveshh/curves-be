import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create';
import { MoveBannerDto } from './dto/order';
import { UpdateBannerDto } from './dto/update';

@Injectable()
export class BannerService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const banners = await this.prismaService.banner.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return ResponseUtil.success(banners);
  }

  async findOne(id: string) {
    const bannerId = Number(id);

    const banner = await this.prismaService.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    return ResponseUtil.success(banner);
  }

  async create(dto: CreateBannerDto) {
    const banner = await this.prismaService.banner.create({
      data: {
        imageUrl: dto.imageUrl,
        header: dto.header,
        primaryText: dto.primaryText,
        description: dto.description || '',
        buttonText: dto.buttonText || '',
        buttonLink: dto.buttonLink || '',
        order: dto.order ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    return ResponseUtil.success(banner, 'Tạo mới thành công');
  }

  async update(id: string, dto: UpdateBannerDto) {
    const bannerId = Number(id);

    const banner = await this.prismaService.banner.findUnique({
      where: { id: bannerId },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    const updatedBanner = await this.prismaService.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        ...(dto.imageUrl !== undefined && {
          imageUrl: dto.imageUrl,
        }),

        ...(dto.header !== undefined && {
          header: dto.header,
        }),

        ...(dto.primaryText !== undefined && {
          primaryText: dto.primaryText,
        }),

        ...(dto.description !== undefined && {
          description: dto.description,
        }),

        ...(dto.buttonText !== undefined && {
          buttonText: dto.buttonText,
        }),

        ...(dto.order !== undefined && {
          order: dto.order,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
    });

    return ResponseUtil.success(updatedBanner, 'Cập nhật thành công');
  }

  async remove(id: string) {
    const bannerId = Number(id);

    const banner = await this.prismaService.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    const deletedBanner = this.prismaService.banner.delete({
      where: {
        id: bannerId,
      },
    });

    return ResponseUtil.success(deletedBanner, 'Xóa thành công');
  }

  async move(id: string, dto: MoveBannerDto) {
    const bannerId = Number(id);

    const banner = await this.prismaService.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    const banners = await this.prismaService.banner.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    const reorderedBanners = banners.filter((item) => item.id !== bannerId);

    reorderedBanners.splice(dto.order, 0, banner);

    await this.prismaService.$transaction(
      reorderedBanners.map((item, index) =>
        this.prismaService.banner.update({
          where: {
            id: item.id,
          },
          data: {
            order: index,
          },
        }),
      ),
    );

    const updatedBanner = await this.prismaService.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    return ResponseUtil.success(updatedBanner, 'Cập nhật thứ tự thành công');
  }
}
