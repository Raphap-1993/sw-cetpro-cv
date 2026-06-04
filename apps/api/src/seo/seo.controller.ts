import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
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

  @Public()
  @Get("public/:pageKey")
  findPublicByPageKey(@Param("pageKey") pageKey: string) {
    return this.seoService.findPublicByPageKey(pageKey);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Put(":pageKey")
  upsert(@Param("pageKey") pageKey: string, @Body() dto: UpsertPageSeoDto) {
    return this.seoService.upsert(pageKey, dto);
  }
}
