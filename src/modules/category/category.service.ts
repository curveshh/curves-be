import { ResponseUtil } from '@/apps/api/common/utils/response';
import { PrismaService } from '@/apps/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create';
import { MoveCategoryDto } from './dto/order';
import { UpdateCategoryDto } from './dto/update';
import { CategoryTree } from './types/tree';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    const categoryMap = new Map<number, CategoryTree>();

    // 1. Tạo node cho tất cả category
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        children: [],
      });
    });

    const tree: CategoryTree[] = [];

    // 2. Gắn children vào parent
    categories.forEach((category) => {
      const node = categoryMap.get(category.id)!;

      if (category.parentId === null) {
        // Category root
        tree.push(node);
        return;
      }

      const parent = categoryMap.get(category.parentId);

      if (parent) {
        parent.children.push(node);
      }
    });

    return ResponseUtil.success(tree);
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prismaService.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId ?? null,
        isActive: dto.isActive ?? true,
      },
    });

    return ResponseUtil.success(category, 'Tạo mới thành công');
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const categoryId = Number(id);

    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),

        ...(dto.slug !== undefined && {
          slug: dto.slug,
        }),

        ...(dto.parentId !== undefined && {
          parentId: dto.parentId,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
    });

    return ResponseUtil.success(updatedCategory, 'Cập nhật thành công');
  }

  async remove(id: string) {
    const categoryId = Number(id);

    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const deletedCategory = await this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });

    return ResponseUtil.success(deletedCategory, 'Xóa thành công');
  }

  async move(id: string, dto: MoveCategoryDto) {
    const categoryId = Number(id);

    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Lấy tất cả category cùng parent
    const siblings = await this.prismaService.category.findMany({
      where: {
        parentId: dto.parentId ?? null,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Loại category đang move ra khỏi danh sách
    const filtered = siblings.filter((item) => item.id !== categoryId);

    // Đưa category vào vị trí mới
    filtered.splice(dto.order, 0, {
      ...category,
      parentId: dto.parentId ?? null,
    });

    // Update toàn bộ order
    await this.prismaService.$transaction(
      filtered.map((item, index) =>
        this.prismaService.category.update({
          where: {
            id: item.id,
          },
          data: {
            parentId: dto.parentId ?? null,
            order: index,
          },
        }),
      ),
    );

    const updatedCategory = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return ResponseUtil.success(updatedCategory, 'Cập nhật thứ tự thành công');
  }

  async getAvailableSlug(slug: string) {
    const baseSlug = slug.trim().toLowerCase();

    const existingCategories = await this.prismaService.category.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    const existingSlugs = new Set(existingCategories.map((category) => category.slug));

    // Slug chưa tồn tại
    if (!existingSlugs.has(baseSlug)) {
      return ResponseUtil.success({
        slug: baseSlug,
        available: true,
      });
    }

    // slug đã tồn tại → tìm slug-1, slug-2...
    let index = 1;

    while (existingSlugs.has(`${baseSlug}-${index}`)) {
      index++;
    }

    return ResponseUtil.success({
      slug: `${baseSlug}-${index}`,
      available: false,
    });
  }
}
