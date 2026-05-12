# ADR-001 - Media Storage Productivo

## Estado

Aprobada el 10 de mayo de 2026.

## Contexto

El estado real del repo para este gate es el siguiente:

- `MediaAsset` persiste una `url` unica y metadatos editoriales.
- `MediaAsset` puede originarse desde `EXTERNAL_URL` o `LOCAL_UPLOAD`.
- `Program.imageUrl` y `ContentBlock.mediaUrl` persisten URLs absolutas.
- El backoffice de `media` registra URLs y tambien permite upload binario local.
- El objetivo de despliegue es una VPS Hestia sin Docker.
- El `2026-05-10` se ejecuto un rehearsal real en la VPS del cliente con
  upload local, servicio del asset bajo `/media/*` y backup de media.

## Decision

La decision productiva para este gate es:

- la media publica vive en filesystem local persistente del usuario del cliente,
  fuera del directorio de build y fuera del artefacto del release;
- el origen de archivos lo gobierna el API NestJS mediante upload local
  autenticado;
- la URL publica canonica de media debe resolverse desde `MEDIA_PUBLIC_BASE_URL`
  y publicarse bajo `/media/*`;
- Hestia/Nginx debe exponer `/media/` por `alias` al directorio configurado en
  `MEDIA_UPLOAD_DIR`;
- la aplicacion sigue guardando URLs HTTPS/HTTP absolutas en base de datos.

Flujo operativo aprobado:

1. Subir el archivo desde `/admin/media` o registrar una URL externa cuando haga
   falta compatibilidad legacy.
2. Verificar la URL final bajo la base publica configurada en
   `MEDIA_PUBLIC_BASE_URL`.
3. Reutilizar el asset desde Programas o Contenido.
4. Respaldar binarios junto con la base antes de migraciones o cutovers.

## Razonamiento

- Evita bloquear el MVP en un proveedor externo no provisionado.
- Ya fue probado de punta a punta en la VPS real del cliente.
- Mantiene el flujo editorial dentro del backoffice sin depender de pasos
  manuales fuera de la aplicacion.
- El directorio persistente fuera del release limita el acoplamiento con build
  y rollback.
- El modelo `MediaAsset` sigue sirviendo igual para URLs externas cuando se
  necesite reutilizarlas.

## Reglas operativas

- `MEDIA_UPLOAD_DIR` debe apuntar a una ruta persistente y escribible por el
  usuario del cliente, por ejemplo
  `/home/<hestia-user>/apps/sw-cetpro-cv/shared/uploads/media`.
- La URL guardada en `MediaAsset.url` debe ser la URL publica final resuelta
  desde `MEDIA_PUBLIC_BASE_URL`.
- La ruta publica canonica para este gate es `/media/*`; `/api/media/uploads/*`
  queda como compatibilidad tecnica, no como preferencia operativa.
- La convencion recomendada de llaves es por año/mes y nombre sanitizado,
  preservando trazabilidad desde `storageKey`.
- Todo asset publicado debe tener `title`, `type`, `status` y `altText`
  cuando aplique.
- Si `MEDIA_DELETE_MANAGED_FILES=true`, al eliminar un `LOCAL_UPLOAD` no
  referenciado tambien se elimina el binario local.

## Fuera de alcance de este gate

- Object storage externo.
- Presigned uploads o multipart direct-to-cloud.
- Transformaciones automaticas de imagen.
- Antivirus o scanning de archivos.
- CDN perimetral dedicado para media.

## Implicancias para siguientes gates

Si mas adelante se quiere migrar a object storage o CDN dedicado, el modelo
actual permite hacerlo sin romper el catalogo editorial: bastaria cambiar
`MEDIA_PUBLIC_BASE_URL`, el destino de upload y la forma de generar `url` /
`storageKey`, manteniendo `MediaAsset` como inventario canonico.
