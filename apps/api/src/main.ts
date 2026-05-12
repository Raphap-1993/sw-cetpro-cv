import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import {
  ensureMediaUploadDir,
  getMediaUploadDir
} from "./media/media-storage";

function isTrustProxyEnabled() {
  const normalized = process.env.TRUST_PROXY?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

async function bootstrap() {
  await ensureMediaUploadDir();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const webOrigins = process.env.WEB_ORIGIN?.split(",").map((origin) =>
    origin.trim()
  );
  const mediaUploadDir = getMediaUploadDir();

  app.enableShutdownHooks();

  if (isTrustProxyEnabled()) {
    app.set("trust proxy", 1);
  }

  app.useStaticAssets(mediaUploadDir, {
    prefix: "/media",
    setHeaders: (response) => {
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  });
  app.useStaticAssets(mediaUploadDir, {
    prefix: "/api/media/uploads"
  });
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: webOrigins?.length ? webOrigins : true,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const port = Number(process.env.API_PORT ?? 4010);
  const host = process.env.API_HOST?.trim() || "127.0.0.1";
  await app.listen(port, host);
}

void bootstrap();
