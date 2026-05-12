import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { ContentService } from "./content.service";
import { CreateContentBlockDto } from "./dto/create-content-block.dto";
import { UpdateContentBlockDto } from "./dto/update-content-block.dto";

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get()
  findAll(@Query("page") page?: string) {
    return this.contentService.findAll(page);
  }

  @Public()
  @Get(":page")
  findPublishedByPage(@Param("page") page: string) {
    return this.contentService.findPublishedByPage(page);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post()
  create(@Body() dto: CreateContentBlockDto) {
    return this.contentService.create(dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateContentBlockDto) {
    return this.contentService.update(id, dto);
  }
}
