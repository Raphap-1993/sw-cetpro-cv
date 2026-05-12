import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMediaAssetDto } from "./dto/create-media-asset.dto";
import { ListMediaAssetsQueryDto } from "./dto/list-media-assets-query.dto";
import { UploadMediaAssetDto } from "./dto/upload-media-asset.dto";
import { UpdateMediaAssetDto } from "./dto/update-media-asset.dto";
import {
  buildLocalMediaUrl,
  deleteUploadedMediaFile,
  guessMediaTypeFromMimeType,
  isSupportedUploadMimeType,
  shouldDeleteManagedMediaFiles,
  writeUploadedMediaFile
} from "./media-storage";

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListMediaAssetsQueryDto) {
    const where: Prisma.MediaAssetWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.q
        ? {
            OR: [
              {
                title: {
                  contains: query.q,
                  mode: "insensitive"
                }
              },
              {
                altText: {
                  contains: query.q,
                  mode: "insensitive"
                }
              },
              {
                url: {
                  contains: query.q,
                  mode: "insensitive"
                }
              }
            ]
          }
        : {})
    };

    return this.prisma.mediaAsset.findMany({
      where,
      orderBy: [
        { status: "asc" },
        { type: "asc" },
        { title: "asc" },
        { createdAt: "desc" }
      ]
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      throw new NotFoundException("Media no encontrada.");
    }

    return asset;
  }

  create(dto: CreateMediaAssetDto) {
    return this.prisma.mediaAsset.create({
      data: {
        ...dto,
        source: "EXTERNAL_URL"
      }
    });
  }

  async update(id: string, dto: UpdateMediaAssetDto) {
    const asset = await this.findOne(id);

    if (
      asset.source === "LOCAL_UPLOAD" &&
      dto.url &&
      dto.url !== asset.url
    ) {
      throw new ConflictException(
        "La URL de un upload local no se edita manualmente. Sube un nuevo archivo si necesitas reemplazarlo."
      );
    }

    return this.prisma.mediaAsset.update({
      where: { id },
      data: dto
    });
  }

  async upload(
    file: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    } | null,
    dto: UploadMediaAssetDto
  ) {
    if (!file) {
      throw new BadRequestException("Selecciona un archivo para subir.");
    }

    if (!isSupportedUploadMimeType(file.mimetype)) {
      throw new BadRequestException(
        "Solo se aceptan imagenes, videos o documentos PDF."
      );
    }

    const { storageKey } = await writeUploadedMediaFile(file);
    const title =
      dto.title || file.originalname.replace(/\.[^.]+$/, "").trim() || "Asset local";

    try {
      return await this.prisma.mediaAsset.create({
        data: {
          title,
          altText: dto.altText,
          url: buildLocalMediaUrl(storageKey),
          type: dto.type ?? guessMediaTypeFromMimeType(file.mimetype),
          status: dto.status ?? "PUBLISHED",
          source: "LOCAL_UPLOAD",
          storageKey
        }
      });
    } catch (error) {
      await this.safeDeleteFile(storageKey);
      throw error;
    }
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    const references = await this.getReferenceCounts(asset.url);

    if (references.programCount > 0 || references.contentBlockCount > 0) {
      throw new ConflictException(
        "No se puede eliminar la media porque sigue referenciada por programas o bloques de contenido."
      );
    }

    const deletedAsset = await this.prisma.mediaAsset.delete({
      where: { id }
    });

    if (
      shouldDeleteManagedMediaFiles() &&
      deletedAsset.source === "LOCAL_UPLOAD" &&
      deletedAsset.storageKey
    ) {
      try {
        await this.safeDeleteFile(deletedAsset.storageKey);
      } catch (error) {
        this.logger.warn(
          `No se pudo limpiar el archivo local ${deletedAsset.storageKey}: ${this.toErrorMessage(
            error
          )}`
        );
      }
    }

    return deletedAsset;
  }

  private async getReferenceCounts(url: string) {
    const [programCount, contentBlockCount] = await Promise.all([
      this.prisma.program.count({
        where: { imageUrl: url }
      }),
      this.prisma.contentBlock.count({
        where: { mediaUrl: url }
      })
    ]);

    return {
      programCount,
      contentBlockCount
    };
  }

  private async safeDeleteFile(storageKey: string) {
    await deleteUploadedMediaFile(storageKey);
  }

  private toErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "error-desconocido";
  }
}
