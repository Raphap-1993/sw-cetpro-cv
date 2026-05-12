# Deploy Readiness

Fecha de evaluacion: 10 de mayo de 2026.

## Alcance

Esta validacion cubre el gate tecnico y operativo para:

- despliegue productivo del monorepo en VPS Hestia sin Docker;
- media storage productivo;
- consistencia entre scripts reales del repo, runbook y rehearsal remoto.

## Resumen ejecutivo

Estado observado del gate: `AMBER / REHEARSAL PASSED`.

Interpretacion:

- el monorepo ya compila y puede desplegarse en VPS Hestia sin Docker;
- la decision de media queda cerrada para este gate con storage local
  persistente gestionado por el API;
- el primer ensayo de despliegue en VPS paso en loopback con PM2, migraciones,
  seed, health, catalogo y upload local;
- el paso a verde total depende todavia del cutover publico de Hestia, DNS y
  smoke por dominio final.

## Evidencia encontrada en el repo

- Monorepo con `apps/web` y `apps/api`.
- Scripts de release y runtime en `ops/bin`, PM2 en `ops/pm2` y ejemplo de
  proxy Hestia en `ops/nginx/sw-cetpro-cv.conf.example`.
- Wrappers operativos compatibles con `APP_ENV_FILE` y `ENV_FILE`, mas prefijo
  opcional `PM2_APP_PREFIX` para separar rehearsal y productivo.
- Plantillas Hestia versionadas en `ops/hestia/swcv-next.tpl` y
  `ops/hestia/swcv-next.stpl` para el proxy productivo del dominio.
- API con `app.setGlobalPrefix("api")`, health publico en `/api/health` y
  readiness extendido en `/api/health/ready`.
- Modelo `MediaAsset` con `source` y `storageKey`, upload local y borrado
  gestionado de binarios.
- Backoffice de media con upload binario local y registro manual por URL.

## Validacion ejecutada

Validacion local corrida sobre este snapshot:

- `pnpm lint` -> OK
- `pnpm prisma:generate` -> OK
- `pnpm prisma:migrate` -> OK
- `pnpm prisma:seed` -> OK
- `pnpm --filter @swcv/api typecheck` -> OK
- `pnpm --filter @swcv/api build` -> OK
- `pnpm --filter @swcv/web lint` -> OK
- `pnpm --filter @swcv/web typecheck` -> OK
- `pnpm --filter @swcv/web build` -> OK
- `./ops/bin/start-api.sh` -> OK
- `./ops/bin/start-web.sh` -> OK
- smoke local de `/programas`, `POST /api/media/upload`, `GET /media/*`,
  `./ops/bin/backup-media.sh` y borrado del asset -> OK

Validacion remota ejecutada el `2026-05-10`:

- VPS verificado: Node `v20.20.0`, `pnpm 10.30.3`, `pm2 6.0.14`,
  PostgreSQL local accesible.
- Base `sw_cetpro_cv_rehearsal` y usuario `swcv_rehearsal` provisionados.
- Arbol aislado desplegado en
  `/home/cetprocesarvallejopucallpa/apps/sw-cetpro-cv-rehearsal`.
- `./ops/bin/deploy-rehearsal.sh` ejecutado con migraciones, build y seed -> OK.
- PM2 levantado en loopback con `--env production`; nombres separables por
  prefijo si comparten usuario -> OK.
- `GET http://127.0.0.1:4010/api/health/ready` -> OK.
- `GET http://127.0.0.1:3010/programas` -> catalogo con 7 programas -> OK.
- login admin, upload local, `HEAD` al asset bajo `/media/*`,
  `./ops/bin/backup-media.sh`, `./ops/bin/backup-postgres.sh` y borrado del
  asset -> OK.

Limitacion conocida de validacion local:

- `./ops/bin/backup-postgres.sh` no pudo validarse en esta maquina por mismatch
  entre `pg_dump` local `14.22` y PostgreSQL local `16.13`. El script ya
  admite `PG_DUMP_BIN` para apuntar al binario correcto y en la VPS existe un
  cliente compatible del propio sistema.

## Condiciones para pasar a verde

- Aplicar el proxy Hestia/Nginx sobre el dominio final usando el ejemplo
  versionado en `ops/nginx/sw-cetpro-cv.conf.example`.
- Definir `WEB_ORIGIN`, `NEXT_PUBLIC_API_URL` y `MEDIA_PUBLIC_BASE_URL` con el
  dominio publico real del cliente.
- Tomar y validar backup SQL en la VPS con el binario `pg_dump` del servidor
  antes del cutover.
- Ejecutar smoke publico por dominio final despues de activar el proxy.

## Riesgos abiertos

- El cutover publico todavia no esta aplicado en Hestia; el rehearsal corrio en
  loopback y no reemplazo el sitio actual.
- `backup-postgres.sh` depende de un `pg_dump` compatible con la version del
  servidor; en macOS local hubo mismatch y debe validarse con el binario de la
  VPS antes de produccion.
- La transferencia por `tar` desde macOS agrega warnings de xattrs de Apple; no
  rompe el rehearsal pero conviene usar `git clone` o `rsync` limpio para el
  deploy definitivo.

## Referencias internas

- [README.md](/Users/rapha/Projects/sw-cetpro-cv/README.md)
- [docs/adr-001-production-media-storage.md](/Users/rapha/Projects/sw-cetpro-cv/docs/adr-001-production-media-storage.md)
- [ops/runbooks/hestia-production-deploy.md](/Users/rapha/Projects/sw-cetpro-cv/ops/runbooks/hestia-production-deploy.md)
- [ops/checklists/deploy-readiness.md](/Users/rapha/Projects/sw-cetpro-cv/ops/checklists/deploy-readiness.md)
