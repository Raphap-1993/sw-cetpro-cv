# Release Discipline

Fecha base: 12 de mayo de 2026.

## Objetivo

Dejar una rutina minima reproducible para desplegar `sw-cetpro-cv` sin depender
de memoria informal del operador.

## Principios

- el release aceptado parte de un `commit` y un `tag` locales, no de un arbol sucio;
- el smoke publico funcional es gate obligatorio del deploy productivo;
- rehearsal ya no es criterio de aceptacion del release: queda como preflight tecnico y restore drill on-demand;
- cada despliegue debe dejar trazabilidad entre `tag`, `SHA`, backup y smoke.

## Flujo recomendado

1. Validar local sobre el ref exacto:

   ```bash
   pnpm release:preflight
   ```

2. Crear o actualizar el commit del release:

   ```bash
   git add .
   git commit -m "chore: <resumen del release>"
   ```

3. Crear tag anotado y metadata local del release:

   ```bash
   ./ops/bin/release-tag.sh release-YYYYMMDD-<slug>
   pnpm release:meta
   ```

4. Antes de sincronizar el nuevo candidato a la VPS, tomar snapshot del release vivo en `current`:

   ```bash
   cd /home/<hestia-user>/apps/sw-cetpro-cv/current
   APP_ENV_FILE=/home/<hestia-user>/apps/sw-cetpro-cv/shared/.env.production \
   ./ops/bin/backup-source.sh
   ```

5. Sincronizar el candidato.

6. Desplegar en producción:

   ```bash
   APP_ENV_FILE=/home/<hestia-user>/apps/sw-cetpro-cv/shared/.env.production \
   ./ops/bin/deploy-production.sh
   ```

   `deploy-production.sh` ya corre smoke publico funcional por defecto.
   Saltarlo con `SKIP_PUBLIC_SMOKE=1` solo es aceptable como bypass de emergencia.

7. Registrar en trazabilidad:

- `tag`
- `SHA`
- backup productivo generado
- snapshot fuente generado
- marker del smoke
- resultado final (`GREEN`, `AMBER`, `FAIL`)

## Rehearsal

- `deploy-rehearsal.sh` usa por defecto `PM2_APP_PREFIX="rehearsal-"`.
- Corre readiness interno y `smoke-public.sh` contra loopback.
- Se apaga al terminar salvo `KEEP_REHEARSAL_ONLINE=1`.
- Su valor principal es validar cambios de infraestructura, media path, migraciones y restore drills.
- No reemplaza el smoke publico sobre dominio real.

## Rollback minimo

Si falla el smoke funcional pero la app arranco:

1. volver al ref anterior local;
2. regenerar `.release-meta.env` para ese ref;
3. resincronizar;
4. redeployar;
5. si hubo migracion incompatible, restaurar DB y media desde backup antes de volver a abrir trafico.
