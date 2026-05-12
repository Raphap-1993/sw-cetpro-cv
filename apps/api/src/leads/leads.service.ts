import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: dto });
  }

  findAll() {
    return this.prisma.lead.findMany({
      include: { program: true },
      orderBy: { createdAt: "desc" }
    });
  }

  updateStatus(
    id: string,
    status: "NEW" | "CONTACTED" | "CLOSED" | "DISCARDED"
  ) {
    return this.prisma.lead.update({
      where: { id },
      data: { status }
    });
  }
}

