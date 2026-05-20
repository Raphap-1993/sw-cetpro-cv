# Stitch MCP Bridge

Puente operativo entre el prototipo de Google Stitch y este repo.

## Decision

Sí se puede inspeccionar y extraer material del proyecto Stitch desde Codex por
MCP, pero no desde `pnpm`, Next.js o NestJS directamente.

Este repo no expone un cliente Stitch propio. El acceso depende de una sesion
de Codex con el servidor MCP de Stitch habilitado.

## Proyecto validado

- Stitch project: `projects/14482316327429983520`
- Title: `CETPRO PUCALLPA`
- Estado validado desde este workspace: `2026-05-20`

## Que funciono

- `list_projects`: devolvio el proyecto privado `CETPRO PUCALLPA`
- `get_project`: devolvio metadata del proyecto y design theme
- `list_screens`: devolvio pantallas del prototipo
- `get_screen`: devolvio metadata de pantalla + `screenshot.downloadUrl`
- descarga manual del screenshot por `curl` usando la URL entregada por MCP:
  validada en local

## Que no quedo confiable

`download_assets` reporto exito hacia `output/stitch-export/`, pero en esta
sesion no materializo archivos en el filesystem del repo. Tratar ese paso como
no confiable hasta revalidarlo.

## Pantallas detectadas

- `e33e338f096049b2a4580a0bcbfadd6a` -> `Home - CETPRO César Vallejo Pucallpa`
- `32b60df9c4ed4c6b84a4c058781e1c54` -> `Home - CETPRO César Vallejo Pucallpa`
- `e3a4b48e7fc2402695649359d74aafca` -> `Study Programs List`
- `aaf37131bf8d42b89ad4e3c432676532` -> `Study Programs List`
- `b0f84464637c4e72a578e22c318ddb1c` -> `About Our Institution`
- `5630af717cb3428bb48d7fd9442d9470` -> `Contact and Admission info`
- `9f3f9cc437f245059a4b6d60829806d9` -> `Program Detail View`
- `3179327f49d44daaa9fc00ab7125af2a` -> `Campus & Student Life Gallery`
- `aba43d7266a8452cb7b77a119af3312e` -> `Transparency Portal`

## Flujo recomendado

1. Desde Codex, consultar `get_project` o `list_screens` del proyecto Stitch.
2. Para una pantalla puntual, pedir `get_screen` y recuperar
   `screenshot.downloadUrl`.
3. Guardar el screenshot en `output/stitch-export/` solo como referencia
   visual temporal.
4. Reimplementar en `apps/web` usando el stack real del repo.
5. No tratar el HTML/CSS generado por Stitch como fuente productiva.

## Fallback operativo actual

Si `download_assets` vuelve a responder OK sin escribir archivos, usar este
patron:

```bash
mkdir -p output/stitch-export
curl -L --fail "<screenshot.downloadUrl>" -o output/stitch-export/<slug>.jpg
```

## Uso correcto en este proyecto

- Stitch sirve para exploracion visual, referencia y handoff.
- La verdad de implementacion sigue en `apps/web`.
- Antes de promover cambios visuales, contrastar contra el gate de
  `institutional authority pass` y evidencia institucional real.
