# sw-cetpro-cv

Monorepo base para el proyecto CETPRO Cesar Vallejo de Pucallpa.

## Stack

- Next.js para web publica y backoffice.
- NestJS para API backend.
- Prisma para modelo de datos y migraciones.
- PostgreSQL como base de datos.
- IAM propio con JWT, roles y permisos.

## Estructura

```text
apps/
  web/   Next.js
  api/   NestJS + Prisma
docs/
  adr-001-production-media-storage.md
  deploy-readiness.md
ops/
  bin/
  checklists/
  nginx/
  pm2/
  runbooks/
  systemd/
```

## Inicio local

```bash
cp .env.example .env
pnpm install
docker compose -f docker-compose.local.yml up -d
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

URLs locales:

- Web: `http://localhost:3010`
- API: `http://localhost:4010/api`

`API_INTERNAL_URL` define la URL servidor-servidor que usa Next.js para
reenviar formularios publicos al API NestJS.

## Operacion productiva

El gate vigente asume despliegue en VPS Hestia sin Docker, con dos procesos
Node persistentes, PostgreSQL separado del ciclo de release y media local
persistente fuera del directorio de build.

- Runbook principal: [ops/runbooks/hestia-production-deploy.md](/Users/rapha/Projects/sw-cetpro-cv/ops/runbooks/hestia-production-deploy.md)
- Checklist de gate: [ops/checklists/deploy-readiness.md](/Users/rapha/Projects/sw-cetpro-cv/ops/checklists/deploy-readiness.md)
- Validacion documental del gate: [docs/deploy-readiness.md](/Users/rapha/Projects/sw-cetpro-cv/docs/deploy-readiness.md)
- Disciplina de release: [docs/release-discipline.md](/Users/rapha/Projects/sw-cetpro-cv/docs/release-discipline.md)
- Decision de media storage: [docs/adr-001-production-media-storage.md](/Users/rapha/Projects/sw-cetpro-cv/docs/adr-001-production-media-storage.md)
- Wrappers de runtime: [ops/bin](/Users/rapha/Projects/sw-cetpro-cv/ops/bin)
- PM2: [ops/pm2/ecosystem.config.cjs](/Users/rapha/Projects/sw-cetpro-cv/ops/pm2/ecosystem.config.cjs)
- `systemd`: [ops/systemd/swcv-api.service](/Users/rapha/Projects/sw-cetpro-cv/ops/systemd/swcv-api.service) y [ops/systemd/swcv-web.service](/Users/rapha/Projects/sw-cetpro-cv/ops/systemd/swcv-web.service)
- Proxy Nginx/Hestia: [ops/nginx/sw-cetpro-cv.conf.example](/Users/rapha/Projects/sw-cetpro-cv/ops/nginx/sw-cetpro-cv.conf.example)

## Decision operativa vigente sobre media

La biblioteca `media` mantiene el catalogo editorial de URLs y ahora tambien
puede registrar uploads locales gestionados por el API.

En produccion:

- la aplicacion guarda URLs absolutas en base de datos;
- los binarios viven en un directorio persistente fuera del release;
- la ruta publica canonica es `/media/*`;
- Hestia o Nginx debe servir `/media` por `alias` al mismo directorio;
- el API mantiene compatibilidad legacy con `/api/media/uploads/*`.

Variables relevantes:

- `MEDIA_UPLOAD_DIR`: directorio persistente de uploads.
- `MEDIA_PUBLIC_BASE_URL`: URL publica canonica de media.
- `MEDIA_ALLOWED_MIME_TYPES`: whitelist de MIME types permitidos.
- `MEDIA_MAX_FILE_SIZE_MB`: limite de subida por archivo.
- `MEDIA_DELETE_MANAGED_FILES`: si borra binarios locales al eliminar el asset.

## Flujo operativo de release

Preflight + tag:

```bash
pnpm release:preflight
./ops/bin/release-tag.sh release-YYYYMMDD-<slug>
pnpm release:meta
```

Deploy recurrente:

```bash
pnpm deploy:production
```

Los wrappers cargan `.env` mediante `APP_ENV_FILE`, luego `ENV_FILE` y por
ultimo `./.env` por defecto. Si el mismo usuario PM2 opera rehearsal y
productivo, usar `PM2_APP_PREFIX` para evitar colision de nombres.

El deploy productivo ya corre smoke publico funcional por defecto. Saltarlo
solo como bypass de emergencia:

```bash
SKIP_PUBLIC_SMOKE=1 pnpm deploy:production
```

## Principio operativo

No usar Payload como base activa. El dominio vive en NestJS, Prisma y
PostgreSQL.
