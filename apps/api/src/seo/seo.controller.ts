import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator";
import { SeoService } from "./seo.service";
import { UpsertPageSeoDto } from "./dto/upsert-page-seo.dto";

@Controller("seo")
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Put(":pageKey")
  upsert(@Param("pageKey") pageKey: string, @Body() dto: UpsertPageSeoDto) {
    return this.seoService.upsert(pageKey, dto);
  }
}
