# Checklist - Deploy Readiness

Fecha base del gate: 10 de mayo de 2026.

## Infraestructura

- [ ] VPS Hestia accesible por SSH.
- [ ] Node.js 20+ instalado.
- [ ] `corepack` habilitado y `pnpm` 10.30.3 operativo.
- [ ] `pm2` operativo para el usuario del cliente.
- [ ] PostgreSQL productivo provisionado.
- [ ] DNS y TLS del dominio final estan listos para cutover.

## Secretos y entorno

- [ ] `DATABASE_URL` apunta a base productiva correcta.
- [ ] `JWT_ACCESS_SECRET` es unico, largo y no reutilizado.
- [ ] `ADMIN_SESSION_SECRET` existe y es distinto de `JWT_ACCESS_SECRET`.
- [ ] `WEB_ORIGIN` incluye todos los origins publicos reales.
- [ ] `API_INTERNAL_URL` usa loopback interno.
- [ ] `NEXT_PUBLIC_API_URL` apunta a `https://<dominio>/api`.
- [ ] `MEDIA_UPLOAD_DIR` apunta a un directorio persistente fuera del release.
- [ ] `MEDIA_PUBLIC_BASE_URL` apunta a `https://<dominio>/media`.
- [ ] `TRUST_PROXY="true"` en produccion detras de Hestia/Nginx.
- [ ] Si rehearsal y productivo comparten usuario PM2, `PM2_APP_PREFIX` evita colision de nombres.
- [ ] `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` estan definidos solo si se va a seedear.

## Base de datos

- [ ] Backup SQL tomado antes de migrar.
- [ ] `pnpm --filter @swcv/api prisma:migrate:deploy` ejecuta sin error.
- [ ] Si es primer deploy, `pnpm prisma:seed` se corre una sola vez y la clave inicial se rota.

## Media storage

- [ ] Directorio persistente de media existe y es escribible.
- [ ] `/media/*` queda servido por alias o proxy segun el ejemplo Nginx versionado.
- [ ] Existe al menos un asset de prueba accesible por URL final.
- [ ] Si todavia hay assets sembrados o fallbacks externos, sus URLs siguen resolviendo por HTTPS.
- [ ] `backup-media.sh` o `backup.sh` funciona sobre el directorio de uploads.
- [ ] El equipo editorial entiende el flujo de upload local y de reutilizacion del asset.

## Aplicacion

- [ ] `pnpm install --frozen-lockfile` ejecuta sin error.
- [ ] `pnpm lint` ejecuta sin error.
- [ ] `pnpm prisma:generate` ejecuta sin error.
- [ ] `pnpm typecheck` ejecuta sin error.
- [ ] `pnpm build` ejecuta sin error.
- [ ] `./ops/bin/deploy-rehearsal.sh` ejecuta sin error en entorno objetivo o rehearsal.
- [ ] Servicios `swcv-api` y `swcv-web` existen y reinician correctamente.

## Reverse proxy

- [ ] Dominio web proxya a `127.0.0.1:3011`.
- [ ] `/api/` proxya a `127.0.0.1:4011`.
- [ ] `/media/` resuelve al directorio local persistente.
- [ ] Health del API responde bajo la URL publica.

## Smoke test

- [ ] `GET /api/health/ready` responde OK.
- [ ] Home publica carga.
- [ ] Programas carga sin errores visibles.
- [ ] El detalle de al menos un programa publicado carga bajo `/programas/<slug>`.
- [ ] El formulario publico de leads responde OK desde Home.
- [ ] El formulario publico de leads responde OK desde el detalle de un programa y mantiene el programa preseleccionado.
- [ ] El lead enviado aparece en `/admin/leads` y queda asociado al programa esperado.
- [ ] Login admin responde.
- [ ] `/admin` carga despues del login y permite navegar a `leads`, `programas`, `contenido` y `media`.
- [ ] Biblioteca de media lista assets.
- [ ] Upload local de media funciona y el asset se sirve por `/media/*`.
- [ ] Alta o edicion editorial simple funciona.

## Matriz de smoke por dominio publico

| Superficie | URL final | Validacion minima |
| --- | --- | --- |
| Health API | `https://<dominio>/api/health/ready` | HTTP 200 y `checks.database.ok=true`, `checks.media.ok=true`. |
| Home publica | `https://<dominio>/` | Render SSR sin error visible, hero, CTA y formulario presentes. |
| Catalogo | `https://<dominio>/programas` | Cards publicadas visibles, links a detalle operativos, sin assets rotos. |
| Detalle programa | `https://<dominio>/programas/<slug-publicado>` | Hero, descripcion, plan y CTA cargan; el formulario llega con programa preseleccionado. |
| Captacion | `https://<dominio>/` y/o `https://<dominio>/programas/<slug-publicado>` | Submit de lead devuelve exito y deja evidencia en backoffice. |
| Login admin | `https://<dominio>/admin/login` | Login valido redirige a `/admin`; credenciales invalidas muestran error controlado. |
| Modulos admin | `https://<dominio>/admin/*` | Dashboard, leads, programas, contenido y media cargan con la sesion activa. |
| Media local | `https://<dominio>/media/<asset-de-prueba>` | HTTP 200/304, tipo de contenido correcto y descarga/render estable. |
| Media externa heredada | URL sembrada vigente | Cada asset externo critico sigue resolviendo mientras no sea migrado. |

## Rollback

- [ ] Existe backup SQL reciente del pre-deploy.
- [ ] Existe backup de media reciente del pre-deploy.
- [ ] Hay commit, branch o tag identificado para rollback.
- [ ] El operador conoce el orden: restore DB/media si hace falta, volver release, rebuild, reiniciar, smoke test.
