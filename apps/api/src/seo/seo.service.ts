import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpsertPageSeoDto } from "./dto/upsert-page-seo.dto";

const publicPageSeoSelect = {
  pageKey: true,
  title: true,
  description: true,
  canonicalUrl: true,
  ogImageUrl: true,
  ogTitle: true,
  ogDescription: true,
  robotsIndex: true,
  robotsFollow: true
} as const;

function toPublicPageSeo(
  record: {
    pageKey: string;
    title: string;
    description: string;
    canonicalUrl: string | null;
    ogImageUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
  } | null
) {
  if (!record) {
    return null;
  }

  return {
    pageKey: record.pageKey,
    title: record.title,
    description: record.description,
    canonicalUrl: record.canonicalUrl,
    ogImageUrl: record.ogImageUrl,
    ogTitle: record.ogTitle,
    ogDescription: record.ogDescription,
    robotsIndex: record.robotsIndex,
    robotsFollow: record.robotsFollow
  };
}

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pageSeo.findMany({
      orderBy: [{ pageKey: "asc" }]
    });
  }

  async findPublicByPageKey(pageKey: string) {
    const record = await this.prisma.pageSeo.findUnique({
      where: { pageKey },
      select: publicPageSeoSelect
    });

    return toPublicPageSeo(record);
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
