import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreatePublicDocumentDto } from "./dto/create-public-document.dto";
import { UpdatePublicDocumentDto } from "./dto/update-public-document.dto";
import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get("admin")
  findAll() {
    return this.documentsService.findAll();
  }

  @Public()
  @Get()
  findPublished() {
    return this.documentsService.findPublished();
  }

  @Public()
  @Get(":slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.documentsService.findPublishedBySlug(slug);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post()
  create(@Body() dto: CreatePublicDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePublicDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documentsService.remove(id);
  }
}
