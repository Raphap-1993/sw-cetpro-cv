import {
  Controller,
  Get,
  ServiceUnavailableException
} from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { getMediaStorageHealth } from "../media/media-storage";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    return this.buildHealthResponse();
  }

  @Public()
  @Get("ready")
  async ready() {
    const health = await this.buildHealthResponse();

    if (!health.ok) {
      throw new ServiceUnavailableException(health);
    }

    return health;
  }

  private async buildHealthResponse() {
    const [database, media] = await Promise.all([
      this.checkDatabase(),
      getMediaStorageHealth()
    ]);

    return {
      ok: database.ok && media.ok,
      service: "sw-cetpro-cv-api",
      timestamp: new Date().toISOString(),
      checks: {
        database,
        media
      }
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "database-check-failed"
      };
    }
  }
}
