import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { ListBlogPostsQueryDto } from "./dto/list-blog-posts-query.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";

function resolvePublishedAt(
  dto: Pick<CreateBlogPostDto, "status" | "publishedAt"> | Pick<UpdateBlogPostDto, "status" | "publishedAt">,
  currentStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
) {
  if (dto.publishedAt) {
    return new Date(dto.publishedAt);
  }

  if (dto.status === "PUBLISHED" && currentStatus !== "PUBLISHED") {
    return new Date();
  }

  return undefined;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query?: ListBlogPostsQueryDto) {
    const where: Prisma.BlogPostWhereInput = {
      ...(query?.status ? { status: query.status } : {}),
      ...(query?.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" } },
              { category: { contains: query.q, mode: "insensitive" } },
              { excerpt: { contains: query.q, mode: "insensitive" } },
              { slug: { contains: query.q, mode: "insensitive" } },
              { body: { contains: query.q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    return this.prisma.blogPost.findMany({
      where,
      orderBy: [
        { updatedAt: "desc" },
        { title: "asc" },
        { slug: "asc" }
      ]
    });
  }

  findPublished() {
    return this.prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { publishedAt: "desc" },
        { updatedAt: "desc" },
        { title: "asc" },
        { slug: "asc" }
      ]
    });
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" }
    });

    if (!post) {
      throw new NotFoundException("Publicacion no encontrada.");
    }

    return post;
  }

  create(dto: CreateBlogPostDto) {
    const publishedAt = resolvePublishedAt(dto);

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        ...(publishedAt ? { publishedAt } : {})
      }
    });
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    return this.prisma.$transaction(async (tx) => {
      const current = await this.findById(tx, id);
      const publishedAt = resolvePublishedAt(dto, current.status);

      return tx.blogPost.update({
        where: { id },
        data: {
          ...dto,
          ...(publishedAt ? { publishedAt } : {})
        }
      });
    });
  }

  async remove(id: string) {
    await this.findById(this.prisma, id);

    return this.prisma.blogPost.delete({
      where: { id }
    });
  }

  private async findById(prisma: Prisma.TransactionClient, id: string) {
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      throw new NotFoundException("Publicacion no encontrada.");
    }

    return post;
  }
}
