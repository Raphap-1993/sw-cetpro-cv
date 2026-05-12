# Runbook - Deploy Productivo en VPS Hestia

## Objetivo

Desplegar `sw-cetpro-cv` en una VPS Hestia sin Docker, con dos procesos Node,
PostgreSQL y media local persistente fuera del directorio de build.

## Topologia recomendada

- `<dominio>` -> Next.js en `127.0.0.1:3011`
- `<dominio>/api/*` -> NestJS en `127.0.0.1:4011`
- `<dominio>/media/*` -> alias de Nginx/Hestia al directorio persistente de uploads
- PostgreSQL -> instancia local o administrada accesible desde la VPS
- Supervisor de procesos -> `PM2` como camino primario, `systemd` como fallback versionado

## Precondiciones

- Node.js 20.20.0 o superior instalado en servidor.
- `corepack` habilitado y `pnpm` 10.30.3 disponible.
- `pm2` disponible para el usuario operativo.
- Usuario operativo de Hestia definido.
- Base PostgreSQL provisionada y accesible.
- Dominio publico ya existente en Hestia o listo para cutover.

## Variables de entorno requeridas

Crear `.env` productivo fuera del control de versiones con al menos:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
API_PORT=4011
API_HOST="127.0.0.1"
WEB_PORT=3011
WEB_HOST="127.0.0.1"
WEB_ORIGIN="https://example.com"
API_INTERNAL_URL="http://127.0.0.1:4011/api"
JWT_ACCESS_SECRET="replace-with-long-random-secret"
JWT_ACCESS_EXPIRES_IN="8h"
NEXT_PUBLIC_API_URL="https://example.com/api"
ADMIN_SESSION_SECRET="replace-with-second-long-random-secret"
MEDIA_STORAGE_DRIVER="local"
MEDIA_UPLOAD_DIR="/home/<hestia-user>/apps/sw-cetpro-cv/shared/uploads/media"
MEDIA_PUBLIC_BASE_URL="https://example.com/media"
MEDIA_DELETE_MANAGED_FILES="true"
TRUST_PROXY="true"
PM2_APP_PREFIX=""
BACKUP_ROOT="/home/<hestia-user>/apps/sw-cetpro-cv/shared/backups"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-me-on-first-deploy"
```

Notas:

- `ADMIN_SESSION_SECRET` debe ser distinto de `JWT_ACCESS_SECRET`.
- `NEXT_PUBLIC_API_URL` debe ser la URL publica real del API bajo el mismo dominio.
- `API_INTERNAL_URL` debe quedar en loopback para trafico servidor-servidor.
- `MEDIA_UPLOAD_DIR` debe vivir fuera de `.next`, `dist` y del directorio de release.
- Si hay mas de un origen publico del sitio, `WEB_ORIGIN` admite lista separada
  por comas.

## Directorio recomendado

Usar directorios persistentes del usuario operativo, por ejemplo:

```text
/home/<hestia-user>/apps/sw-cetpro-cv/current
/home/<hestia-user>/apps/sw-cetpro-cv/shared/backups
/home/<hestia-user>/apps/sw-cetpro-cv/shared/uploads/media
```

Rehearsal verificado el `2026-05-10`:

```text
/home/cetprocesarvallejopucallpa/apps/sw-cetpro-cv-rehearsal
```

Politica vigente:

- rehearsal ya no es sombra permanente por defecto;
- queda como entorno de preflight tecnico y restore drill;
- `deploy-rehearsal.sh` usa prefijo `rehearsal-`, corre smoke sobre loopback y
  se apaga al final salvo `KEEP_REHEARSAL_ONLINE=1`.

## Primer deploy

```bash
mkdir -p /home/<hestia-user>/apps/sw-cetpro-cv/current
mkdir -p /home/<hestia-user>/apps/sw-cetpro-cv/shared/uploads/media
mkdir -p /home/<hestia-user>/apps/sw-cetpro-cv/shared/backups
```

Usar `pnpm prisma:seed` solo en el primer deploy o cuando se necesite poblar
datos base de forma controlada. Si se usa para crear el primer admin, rotar la
clave inmediatamente.

## Deploy recurrente

```bash
cd /home/<hestia-user>/apps/sw-cetpro-cv/current
git fetch --all --tags
git checkout <branch-o-tag>

APP_ENV_FILE=/home/<hestia-user>/apps/sw-cetpro-cv/shared/.env.production \
BACKUP_ROOT=/home/<hestia-user>/apps/sw-cetpro-cv/shared/backups \
./ops/bin/deploy-production.sh
```

Disciplina operativa recomendada:

1. validar localmente `pnpm release:preflight`;
2. crear `commit` y `tag` del release;
3. generar `.release-meta.env` con `pnpm release:meta`;
4. tomar snapshot del release vivo en la VPS antes de sincronizar el nuevo
   candidato;
5. sincronizar el repo;
6. correr `deploy-production.sh`, que ya ejecuta smoke publico funcional salvo
   `SKIP_PUBLIC_SMOKE=1`.

## PM2

Camino validado en rehearsal y recomendado para productivo:

```bash
pm2 startOrReload ops/pm2/ecosystem.config.cjs --env production --update-env
pm2 save
pm2 status
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <hestia-user> --hp /home/<hestia-user>
```

Notas:

- `APP_ENV_FILE` puede apuntar a un `.env` fuera del directorio `current`.
- Si rehearsal y productivo comparten el mismo usuario PM2, usar por ejemplo
  `PM2_APP_PREFIX="rehearsal-"` en el entorno del rehearsal.
- Validar el estado final del unit `pm2-<hestia-user>`. En esta VPS, el unit
  generado por `pm2 startup` requirio ajuste a `Type=oneshot` +
  `RemainAfterExit=yes` porque `PIDFile` no aparecia a tiempo con `Type=forking`.

## Servicios `systemd`

Las unidades versionadas en `ops/systemd` quedan como fallback si mas adelante
se decide sacar PM2 del camino operativo.

## Reverse proxy en Hestia

Configurar Hestia/Nginx para exponer:

- `/` hacia `http://127.0.0.1:3011`
- `/api/` hacia `http://127.0.0.1:4011`
- `/media/` por `alias` al directorio persistente de uploads

Usar preferentemente la plantilla Hestia versionada en
`ops/hestia/swcv-next.tpl` y `ops/hestia/swcv-next.stpl`, copiandola a
`/usr/local/hestia/data/templates/web/nginx/` y luego aplicandola con
`v-change-web-domain-proxy-tpl`.
Mantener TLS terminado en Hestia y trafico interno por loopback.

## Media productiva

- Servir media desde el directorio local persistente configurado en `MEDIA_UPLOAD_DIR`.
- Mantener la URL publica canonica bajo `MEDIA_PUBLIC_BASE_URL`, idealmente
  `https://<dominio>/media`.
- Registrar assets desde `/admin/media` y reutilizarlos desde Programas o Contenido.
- Respaldar binarios locales antes de migraciones y cutovers.

## Smoke test posterior a deploy

```bash
APP_ENV_FILE=/home/<hestia-user>/apps/sw-cetpro-cv/shared/.env.production \
./ops/bin/smoke-public.sh
```

`deploy-production.sh` ya ejecuta este smoke por defecto despues del readiness
interno. `check-readiness.sh` queda como sonda minima de infraestructura, no
como criterio suficiente de aceptacion del release.

## Backup antes de migraciones

Tomar backup de la base y de la media antes de `prisma migrate deploy`.

Ejemplo:

```bash
./ops/bin/backup.sh
```

## Rollback

Si el problema es solo de aplicacion:

1. Volver al commit o tag anterior.
2. Reinstalar dependencias si cambiaron.
3. Rebuild.
4. Reiniciar `swcv-api` y `swcv-web`.

Si el problema incluye migracion incompatible:

1. Poner el sitio en modo de mantenimiento operativo.
2. Restaurar backup de PostgreSQL y media.
3. Volver al release anterior.
4. Repetir smoke tests basicos.
