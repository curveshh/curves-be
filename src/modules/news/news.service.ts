import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PublicationStatus } from '@prisma/client';

import { PrismaService } from '@/apps/database/prisma.service';

import { STORY_BADGE_OPTIONS } from '@/apps/api/common/constants/news';
import { ResponseUtil } from '@/apps/api/common/utils/response';
import { CreateNewsPostDto } from './dto/create';
import { SearchNews } from './dto/search';
import { UpdateNewsPostDto } from './dto/update';

@Injectable()
export class NewsService {
  constructor(private readonly prismaService: PrismaService) {}

  findPublished() {
    return this.prismaService.newsPost.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        menuLinks: { include: { menu: { select: { id: true, title: true, slug: true } } } },
      },
    });
  }

  async findAll(dto: SearchNews) {
    const { page = 1, limit = 20, isHome, category, badge } = dto;
    const skip = (page - 1) * limit;
    const where = {
      ...(isHome !== undefined && { isHome }),
      ...(category &&
        category !== 'all' && {
          category: {
            slug: category,
          },
        }),
      ...(badge &&
        badge !== 'all' && {
          badge,
        }),
    };

    const [news, total] = await Promise.all([
      this.prismaService.newsPost.findMany({
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          category: true,
        },
        where,
      }),

      this.prismaService.newsPost.count({
        where,
      }),
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

  async findPublishedBySlug(slug: string) {
    const post = await this.prismaService.newsPost.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED },
      include: {
        category: true,
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return ResponseUtil.success(post);
  }

  async create(authorId: string, dto: CreateNewsPostDto) {
    const { status, ...post } = dto;

    const isPublished = status === PublicationStatus.PUBLISHED;

    const news = await this.prismaService.newsPost.create({
      data: {
        ...post,
        authorId,
        status: status ?? PublicationStatus.DRAFT,
        publishedAt: isPublished ? new Date().toISOString() : '',
      },
    });

    return ResponseUtil.success(news, 'Tạo mới thành công');
  }

  async update(id: string, dto: UpdateNewsPostDto) {
    await this.findOne(id);
    const { status, ...post } = dto;

    const news = await this.prismaService.newsPost.update({
      where: { id },
      data: {
        ...post,
        status,
        publishedAt: status === PublicationStatus.PUBLISHED ? new Date().toISOString() : '',
      },
    });

    return ResponseUtil.success(news, 'Cập nhật thành công');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.newsPost.delete({ where: { id } });
    return ResponseUtil.success(id, 'Xóa thành công');
  }

  private async findOne(id: string) {
    const post = await this.prismaService.newsPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  private async assertMenus(menuIds?: string[]) {
    if (!menuIds?.length) return;
    if (new Set(menuIds).size !== menuIds.length)
      throw new BadRequestException('menuIds must not contain duplicates');
    const count = await this.prismaService.menuItem.count({ where: { id: { in: menuIds } } });
    if (count !== menuIds.length) throw new BadRequestException('One or more menus do not exist');
  }

  async checkSlug(slug: string) {
    const baseSlug = slug.trim().toLowerCase();

    const existingNews = await this.prismaService.newsPost.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    const existingSlugs = new Set(existingNews.map((item) => item.slug));

    // Chưa tồn tại
    if (!existingSlugs.has(baseSlug)) {
      return ResponseUtil.success({
        slug: baseSlug,
        available: true,
      });
    }
    let index = 1;
    while (existingSlugs.has(`${baseSlug}-${index}`)) {
      index++;
    }

    return ResponseUtil.success({
      slug: `${baseSlug}-${index}`,
      available: false,
    });
  }

  getBadgeOptions() {
    return ResponseUtil.success(STORY_BADGE_OPTIONS);
  }
}
