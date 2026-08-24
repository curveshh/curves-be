import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublicationStatus } from '@prisma/client';

import { PrismaService } from '@/apps/database/prisma.service';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

const publicPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
} as const;

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto) {
    await this.assertParent(dto.parentId);
    await this.assertPosts(dto.postIds);

    const { postIds, ...menu } = dto;
    return this.prisma.menuItem.create({
      data: {
        ...menu,
        posts: postIds?.length
          ? { create: postIds.map((postId, sortOrder) => ({ postId, sortOrder })) }
          : undefined,
      },
      include: this.adminInclude,
    });
  }

  async findTree() {
    const menus = await this.prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: {
        posts: {
          where: { post: { status: PublicationStatus.PUBLISHED } },
          orderBy: { sortOrder: 'asc' },
          include: { post: { select: publicPostSelect } },
        },
      },
    });

    const childrenByParent = new Map<string | null, (typeof menus)[number][]>();
    for (const menu of menus) {
      const key = menu.parentId ?? null;
      childrenByParent.set(key, [...(childrenByParent.get(key) ?? []), menu]);
    }

    const buildTree = (parentId: string | null): unknown[] =>
      (childrenByParent.get(parentId) ?? []).map(({ posts, ...menu }) => ({
        ...menu,
        posts: posts.map(({ post }) => post),
        children: buildTree(menu.id),
      }));

    return buildTree(null);
  }

  async findBySlug(slug: string) {
    const menu = await this.prisma.menuItem.findFirst({
      where: { slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        },
        posts: {
          where: { post: { status: PublicationStatus.PUBLISHED } },
          orderBy: { sortOrder: 'asc' },
          include: { post: { select: publicPostSelect } },
        },
      },
    });

    if (!menu) throw new NotFoundException('Menu not found');
    return { ...menu, posts: menu.posts.map(({ post }) => post) };
  }

  async findOne(id: string) {
    const menu = await this.prisma.menuItem.findUnique({ where: { id }, include: this.adminInclude });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.findOne(id);
    await this.assertParent(dto.parentId, id);
    await this.assertPosts(dto.postIds);

    const { postIds, ...menu } = dto;
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...menu,
        posts:
          postIds === undefined
            ? undefined
            : {
                deleteMany: {},
                create: postIds.map((postId, sortOrder) => ({ postId, sortOrder })),
              },
      },
      include: this.adminInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.menuItem.delete({ where: { id } });
    return { id };
  }

  private readonly adminInclude = {
    parent: { select: { id: true, title: true, slug: true } },
    children: { orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] },
    posts: { orderBy: { sortOrder: 'asc' }, include: { post: { select: publicPostSelect } } },
  } satisfies Prisma.MenuItemInclude;

  private async assertPosts(postIds?: string[]) {
    if (!postIds?.length) return;
    if (new Set(postIds).size !== postIds.length) {
      throw new BadRequestException('postIds must not contain duplicates');
    }

    const count = await this.prisma.newsPost.count({ where: { id: { in: postIds } } });
    if (count !== postIds.length) throw new BadRequestException('One or more posts do not exist');
  }

  private async assertParent(parentId?: string, currentId?: string) {
    if (!parentId) return;
    if (parentId === currentId) throw new BadRequestException('A menu cannot be its own parent');

    let parent = await this.prisma.menuItem.findUnique({
      where: { id: parentId },
      select: { id: true, parentId: true },
    });
    if (!parent) throw new BadRequestException('Parent menu does not exist');

    while (parent) {
      if (parent.id === currentId) throw new BadRequestException('A menu cannot be moved under its child');
      parent = parent.parentId
        ? await this.prisma.menuItem.findUnique({
            where: { id: parent.parentId },
            select: { id: true, parentId: true },
          })
        : null;
    }
  }
}
