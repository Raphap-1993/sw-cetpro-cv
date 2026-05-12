import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateMediaAssetDto } from "./dto/create-media-asset.dto";
import { ListMediaAssetsQueryDto } from "./dto/list-media-assets-query.dto";
import { UploadMediaAssetDto } from "./dto/upload-media-asset.dto";
import { UpdateMediaAssetDto } from "./dto/update-media-asset.dto";
import { MediaService } from "./media.service";
import {
  getMediaMaxUploadSizeBytes,
  isSupportedUploadMimeType
} from "./media-storage";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get()
  findAll(@Query() query: ListMediaAssetsQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.mediaService.findOne(id);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post()
  create(@Body() dto: CreateMediaAssetDto) {
    return this.mediaService.create(dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: getMediaMaxUploadSizeBytes()
      },
      fileFilter: (_request, file, callback) => {
        if (isSupportedUploadMimeType(file.mimetype)) {
          callback(null, true);
          return;
        }

        callback(
          new BadRequestException(
            `Tipo de archivo no permitido: ${file.mimetype}.`
          ),
          false
        );
      }
    })
  )
  upload(
    @UploadedFile()
    file: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    } | null,
    @Body() dto: UploadMediaAssetDto
  ) {
    return this.mediaService.upload(file, dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateMediaAssetDto) {
    return this.mediaService.update(id, dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.mediaService.remove(id);
  }
}
