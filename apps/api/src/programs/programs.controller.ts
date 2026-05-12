import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateProgramDto } from "./dto/create-program.dto";
import { ReorderProgramDto } from "./dto/reorder-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { ProgramsService } from "./programs.service";

@Controller("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get("admin")
  findAll() {
    return this.programsService.findAll();
  }

  @Public()
  @Get()
  findPublished() {
    return this.programsService.findPublished();
  }

  @Public()
  @Get(":slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.programsService.findPublishedBySlug(slug);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProgramDto) {
    return this.programsService.update(id, dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post(":id/reorder")
  reorder(@Param("id") id: string, @Body() dto: ReorderProgramDto) {
    return this.programsService.reorder(id, dto.direction);
  }
}
