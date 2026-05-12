import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { LeadsService } from "./leads.service";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Roles("SUPER_ADMIN", "ADMISSIONS_MANAGER")
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Roles("SUPER_ADMIN", "ADMISSIONS_MANAGER")
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.leadsService.updateStatus(id, dto.status);
  }
}

