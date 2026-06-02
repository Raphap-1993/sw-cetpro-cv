import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpsertPageSeoDto } from "./dto/upsert-page-seo.dto";

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pageSeo.findMany({
      orderBy: [{ pageKey: "asc" }]
    });
  }

  upsert(pageKey: string, dto: UpsertPageSeoDto) {
    return this.prisma.pageSeo.upsert({
      where: { pageKey },
      create: {
        pageKey,
        ...dto
      },
      update: dto
    });
  }
}
