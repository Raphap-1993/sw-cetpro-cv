import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContentBlockDto } from "./dto/create-content-block.dto";
import { UpdateContentBlockDto } from "./dto/update-content-block.dto";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page?: string) {
    return this.prisma.contentBlock.findMany({
      where: page ? { page } : undefined,
      orderBy: [{ page: "asc" }, { position: "asc" }, { updatedAt: "desc" }]
    });
  }

  findPublishedByPage(page: string) {
    return this.prisma.contentBlock.findMany({
      where: { page, status: "PUBLISHED" },
      orderBy: { position: "asc" }
    });
  }

  create(dto: CreateContentBlockDto) {
    return this.prisma.contentBlock.create({ data: dto });
  }

  update(id: string, dto: UpdateContentBlockDto) {
    return this.prisma.contentBlock.update({
      where: { id },
      data: dto
    });
  }
}
