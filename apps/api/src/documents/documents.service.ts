import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePublicDocumentDto } from "./dto/create-public-document.dto";
import { UpdatePublicDocumentDto } from "./dto/update-public-document.dto";

const publicDocumentInclude = {
  mediaAsset: true
} satisfies Prisma.PublicDocumentInclude;

type PublicDocumentRecord = Prisma.PublicDocumentGetPayload<{
  include: typeof publicDocumentInclude;
}>;

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const documents = await this.prisma.publicDocument.findMany({
      include: publicDocumentInclude,
      orderBy: [
        { position: "asc" },
        { title: "asc" },
        { slug: "asc" }
      ]
    });

    return documents.map((document) => this.serialize(document));
  }

  async findPublished() {
    const documents = await this.prisma.publicDocument.findMany({
      include: publicDocumentInclude,
      where: { status: "PUBLISHED" },
      orderBy: [
        { position: "asc" },
        { title: "asc" },
        { slug: "asc" }
      ]
    });

    return documents.map((document) => this.serialize(document));
  }

  async findPublishedBySlug(slug: string) {
    const document = await this.prisma.publicDocument.findFirst({
      include: publicDocumentInclude,
      where: { slug, status: "PUBLISHED" }
    });

    if (!document) {
      throw new NotFoundException("Documento publico no encontrado.");
    }

    return this.serialize(document);
  }

  async create(dto: CreatePublicDocumentDto) {
    await this.ensureMediaAssetExists(dto.mediaAssetId);

    const document = await this.prisma.publicDocument.create({
      include: publicDocumentInclude,
      data: dto
    });

    return this.serialize(document);
  }

  async update(id: string, dto: UpdatePublicDocumentDto) {
    await this.findById(this.prisma, id);

    if (dto.mediaAssetId) {
      await this.ensureMediaAssetExists(dto.mediaAssetId);
    }

    const document = await this.prisma.publicDocument.update({
      include: publicDocumentInclude,
      where: { id },
      data: dto
    });

    return this.serialize(document);
  }

  async remove(id: string) {
    await this.findById(this.prisma, id);

    const document = await this.prisma.publicDocument.delete({
      include: publicDocumentInclude,
      where: { id }
    });

    return this.serialize(document);
  }

  private async findById(
    prisma: Prisma.TransactionClient | PrismaService,
    id: string
  ) {
    const document = await prisma.publicDocument.findUnique({
      include: publicDocumentInclude,
      where: { id }
    });

    if (!document) {
      throw new NotFoundException("Documento publico no encontrado.");
    }

    return document;
  }

  private async ensureMediaAssetExists(mediaAssetId: string) {
    const mediaAsset = await this.prisma.mediaAsset.findUnique({
      where: { id: mediaAssetId }
    });

    if (!mediaAsset) {
      throw new NotFoundException("Media no encontrada.");
    }
  }

  private serialize(document: PublicDocumentRecord) {
    return {
      ...document,
      url: document.mediaAsset.url
    };
  }
}
