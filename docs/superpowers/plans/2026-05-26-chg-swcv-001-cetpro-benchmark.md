# CHG-SWCV-001 CETPRO Benchmark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the benchmark package for `CHG-SWCV-001`: select 5 official-filtered CETPRO/CEPRO references, normalize their public structure into versioned datasets, derive the target web architecture and CRUD model for `CETPRO Cesar Vallejo`, and leave a prioritized backlog plus governance checks.

**Architecture:** Keep research artifacts in a dedicated benchmark package under `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/`, write target architecture outputs in `docs/fase-3-arquitectura/`, and keep backlog outputs in `docs/fase-1-analisis-requerimientos/`. Add one repository governance check so the benchmark package remains linked and verifiable from `pnpm check:project`.

**Tech Stack:** Markdown, JSON, Node.js governance scripts, repo documentation, `pnpm`, `node --test`, and web research using official Peruvian sources plus public reference sites.

---

## File Structure

### Create
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/README.md`
  Purpose: entrypoint for the benchmark package and artifact index.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md`
  Purpose: candidate pool, official source evidence, selection rationale for the 5 chosen references.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md`
  Purpose: side-by-side comparison and scoring across compliance, architecture, and conversion.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md`
  Purpose: current CETPRO site gaps against the target benchmark patterns.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-01.md`
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-02.md`
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-03.md`
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-04.md`
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-05.md`
  Purpose: one normalized reference sheet per selected site.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json`
  Purpose: site-level dataset with identity and final scoring.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/pages.json`
  Purpose: normalized public page map across all references.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/flows.json`
  Purpose: normalized contact, inquiry, WhatsApp, pre-enrollment, and admission flows.
- `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/compliance.json`
  Purpose: visible compliance pages and documents by site.
- `docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md`
  Purpose: prioritized downstream changes to open in Fase 4/Fase 5/Fase 6.
- `docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md`
  Purpose: target public information architecture and page map for the CETPRO site.
- `docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md`
  Purpose: first-version data-managed content model and CRUD boundaries.
- `scripts/check-cetpro-benchmark.mjs`
  Purpose: governance check for the benchmark artifact package.
- `tests/governance/check-cetpro-benchmark.test.mjs`
  Purpose: automated test coverage for the benchmark governance check.

### Modify
- `docs/fase-1-analisis-requerimientos/README.md`
  Purpose: link the benchmark package and derived backlog.
- `docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md`
  Purpose: keep `CHG-SWCV-001` status aligned and append derived child changes after benchmark completion.
- `docs/fase-1-analisis-requerimientos/01.02-benchmark-referencias-cetpro-arquitectura-web-objetivo.md`
  Purpose: mark benchmark execution state if needed.
- `docs/README.md`
  Purpose: link the benchmark package as a canonical Fase 1 artifact.
- `AI_CONTEXT.md`
  Purpose: add current benchmark status and next-step reference.
- `TRACEABILITY_MATRIX.md`
  Purpose: point to `CHG-SWCV-001` outputs and downstream change set.
- `package.json`
  Purpose: wire the new benchmark governance check into the repo checks.

### Reference While Executing
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/programas/page.tsx`
- `apps/web/src/app/programas/[slug]/page.tsx`
- `apps/web/src/app/institucion/page.tsx`
- `apps/web/src/app/admision/page.tsx`
- `apps/web/src/app/gestion-institucional/page.tsx`
- `apps/web/src/app/libro-de-reclamaciones/page.tsx`
- `apps/web/src/app/public-site.ts`
- `apps/web/src/app/page-content.ts`
  Purpose: current-site baseline when writing the gap analysis and target architecture.

## Task 1: Scaffold The Benchmark Artifact Package

**Files:**
- Modify: `docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md`
- Modify: `docs/fase-1-analisis-requerimientos/01.02-benchmark-referencias-cetpro-arquitectura-web-objetivo.md`
- Modify: `docs/fase-1-analisis-requerimientos/README.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/README.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/pages.json`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/flows.json`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/compliance.json`

- [ ] **Step 1: Update state markers so the repo reflects the approved spec**

```md
| `CHG-SWCV-001` | Benchmark de referencias CETPRO y arquitectura web objetivo | `nueva-capacidad` | `web-publica` | `nueva` | `1 -> 4 -> 5 -> 6` | `alta` | `aprobado` | Benchmark canonico balanceado de 5 referencias peruanas para definir IA, compliance, preinscripcion y modelo CRUD objetivo del sitio. |
```

```md
- estado: `aprobada por usuario`
```

- [ ] **Step 2: Create the benchmark package skeleton with a concrete index**

```md
# Benchmark CHG-SWCV-001

## Objetivo
Concentrar la evidencia y traduccion arquitectonica del benchmark de referencias
`CETPRO/CEPRO` para `CETPRO Cesar Vallejo`.

## Artefactos
- [00 - Universo y seleccion](00-universo-y-seleccion.md)
- [01 - Matriz comparativa](01-matriz-comparativa.md)
- [02 - Brecha actual vs objetivo](02-brecha-actual-vs-objetivo.md)
- `sites/`
- `data/`
```

```json
[]
```

- [ ] **Step 3: Link the benchmark package from the Fase 1 README**

```md
## Artefactos
- [01.00 - Analisis de requerimientos](01.00-analisis-requerimientos.md)
- [01.01 - Backlog de cambios de la siguiente iteracion](01.01-backlog-cambios-siguiente-iteracion.md)
- [01.02 - Benchmark de referencias CETPRO y arquitectura web objetivo](01.02-benchmark-referencias-cetpro-arquitectura-web-objetivo.md)
- [Benchmark CHG-SWCV-001](benchmark/chg-swcv-001/README.md)
```

- [ ] **Step 4: Verify the scaffold exists and is linked**

Run: `rg -n "CHG-SWCV-001|benchmark/chg-swcv-001|aprobada por usuario" docs/fase-1-analisis-requerimientos -S`
Expected: matches in the backlog, spec, README, and benchmark package files.

- [ ] **Step 5: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/README.md \
  docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md \
  docs/fase-1-analisis-requerimientos/01.02-benchmark-referencias-cetpro-arquitectura-web-objetivo.md \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001
git commit -m "docs: scaffold benchmark package for chg-swcv-001"
```

## Task 2: Build The Official Candidate Universe And Lock The 5 References

**Files:**
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-01.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-02.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-03.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-04.md`
- Create: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-05.md`

- [ ] **Step 1: Build the candidate pool from official or quasi-official Peruvian sources**

Use the `web` tool with source-first queries such as:
- `site:gob.pe CETPRO Pucallpa`
- `site:pe CETPRO "libro de reclamaciones"`
- `site:gob.pe CETPRO resolucion`
- `site:edu.pe CETPRO admision`

Capture this table in `00-universo-y-seleccion.md`:

```md
| Candidato | URL | Fuente oficial o cuasi oficial | Evidencia oficial | Calidad publica inicial | Decision |
| --- | --- | --- | --- | --- | --- |
| CETPRO X | https://... | Directorio/portal ... | resolucion/listado/enlace | alta/media/baja | shortlist |
```

- [ ] **Step 2: Select exactly 5 references and justify each choice**

Append this section:

 ```md
## Muestra cerrada
1. `site-01`: razon de inclusion.
2. `site-02`: razon de inclusion.
3. `site-03`: razon de inclusion.
4. `site-04`: razon de inclusion.
5. `site-05`: razon de inclusion.
```

- [ ] **Step 3: Create one normalized stub sheet per selected site**

Use this exact site-sheet structure for each `sites/site-0N.md`:

```md
# Site 01

## Nombre institucional real
- nombre:

## Identidad
- URL base:
- tipo:
- fuente oficial:
- evidencia oficial:

## Mapa visible
- menu principal:
- menu secundario:
- paginas clave:

## Flujos publicos
- contacto:
- WhatsApp:
- solicitud de informacion:
- preinscripcion:
- admision:

## Compliance visible
- privacidad:
- libro de reclamaciones:
- reglamentos/resoluciones:
- costos/requisitos:

## Lectura UX/IA
- fortaleza principal:
- debilidad principal:
- patron rescatable:
```

- [ ] **Step 4: Verify the 5-site package is complete**

Run: `find docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites -maxdepth 1 -type f | sort`
Expected: exactly five `site-0N.md` files.

- [ ] **Step 5: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites
git commit -m "docs: select five cetpro benchmark references"
```

## Task 3: Normalize Site Identity And Scoring Data

**Files:**
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-01.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-02.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-03.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-04.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-05.md`

- [ ] **Step 1: Fill `sites.json` with the exact schema below**

```json
[
  {
    "siteId": "site-01",
    "institutionName": "Institucion seleccionada 01",
    "entityType": "CETPRO",
    "baseUrl": "https://...",
    "officialSourceUrl": "https://...",
    "officialEvidence": "listado oficial o directorio regional visible",
    "publicQualityNotes": "sitio con cobertura publica util para benchmark",
    "scores": {
      "compliance": 0,
      "architecture": 0,
      "conversion": 0,
      "total": 0
    }
  }
]
```

- [ ] **Step 2: Fill the score values only after completing each site sheet**

Scoring rule:
- `0-3`: weak
- `4-6`: acceptable
- `7-8`: strong
- `9-10`: benchmark-grade

Use a short justification sentence inside each site sheet:

```md
## Score resumido
- compliance: `7` - publica libro de reclamaciones y requisitos, pero no costos.
- architecture: `8` - menu claro, programas bien jerarquizados.
- conversion: `6` - CTA presente, pero formulario poco visible.
```

- [ ] **Step 3: Validate the JSON structure**

Run: `node -e "JSON.parse(require('node:fs').readFileSync('docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json','utf8')); console.log('sites ok')"`
Expected: `sites ok`

- [ ] **Step 4: Cross-check there is one `siteId` per sheet**

Run: `rg -n "^# Site|^## Score resumido|site-0[1-5]" docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json -S`
Expected: each selected site appears in both the markdown sheet and the JSON dataset.

- [ ] **Step 5: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/sites.json \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites
git commit -m "docs: normalize cetpro benchmark site metadata"
```

## Task 4: Normalize Pages, Flows, And Compliance Signals

**Files:**
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/pages.json`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/flows.json`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/compliance.json`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-01.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-02.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-03.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-04.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites/site-05.md`

- [ ] **Step 1: Populate `pages.json` with one record per relevant public page**

```json
[
  {
    "pageId": "site-01::programa-cosmetologia",
    "siteId": "site-01",
    "title": "Cosmetologia",
    "url": "https://.../cosmetologia",
    "pageType": "programa",
    "menuPlacement": "Programas",
    "hierarchyLevel": 2,
    "primaryCta": "Preinscribete",
    "notes": "detalle por programa con foto y CTA"
  }
]
```

- [ ] **Step 2: Populate `flows.json` with public conversion and admission flows**

```json
[
  {
    "flowType": "preinscripcion",
    "siteId": "site-01",
    "originPageId": "site-01::programa-cosmetologia",
    "scope": "por-programa",
    "approxFieldCount": 6,
    "complexity": "simple",
    "primaryCta": "Preinscribete",
    "exitChannel": "formulario-web",
    "notes": "captura nombre, telefono, correo y programa"
  }
]
```

- [ ] **Step 3: Populate `compliance.json` with visible compliance and institutional proof**

```json
[
  {
    "siteId": "site-01",
    "assetType": "libro-reclamaciones",
    "title": "Libro de reclamaciones",
    "url": "https://.../libro-de-reclamaciones",
    "availability": "publico",
    "notes": "enlace visible desde footer"
  }
]
```

- [ ] **Step 4: Validate all JSON datasets in one pass**

Run: `node -e "for (const file of ['pages','flows','compliance']) { JSON.parse(require('node:fs').readFileSync('docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/' + file + '.json','utf8')); console.log(file + ' ok'); }"`
Expected:

```text
pages ok
flows ok
compliance ok
```

- [ ] **Step 5: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/pages.json \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/flows.json \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/data/compliance.json \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/sites
git commit -m "docs: normalize cetpro benchmark structure and flows"
```

## Task 5: Write The Comparative Matrix And Current-State Gap Analysis

**Files:**
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md`
- Modify: `docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md`
- Reference: `apps/web/src/app/page.tsx`
- Reference: `apps/web/src/app/programas/page.tsx`
- Reference: `apps/web/src/app/programas/[slug]/page.tsx`
- Reference: `apps/web/src/app/institucion/page.tsx`
- Reference: `apps/web/src/app/admision/page.tsx`
- Reference: `apps/web/src/app/gestion-institucional/page.tsx`
- Reference: `apps/web/src/app/libro-de-reclamaciones/page.tsx`

- [ ] **Step 1: Write the side-by-side matrix with explicit scoring**

Use this matrix skeleton:

```md
| Site ID | Institucion | Compliance | Arquitectura | Conversion | Observacion clave |
| --- | --- | --- | --- | --- | --- |
| site-01 | Institucion 01 | 7 | 8 | 6 | buen detalle de programas |
```

Then add these sections:

```md
## Patrones a adoptar
- ...

## Patrones a evitar
- ...

## Referencia mas fuerte por eje
- compliance:
- arquitectura:
- conversion:
```

- [ ] **Step 2: Write the gap analysis against the current CETPRO site**

Use this structure:

```md
## Estado actual visible
- home:
- programas:
- admision:
- institucional:
- compliance:

## Brechas principales
1. ...
2. ...
3. ...

## Ganancias de mayor impacto
1. ...
2. ...
3. ...
```

- [ ] **Step 3: Ground the gap analysis against real current files**

Run: `rg -n "HomeHeroSlider|HomeProgramsCarousel|PublicSiteFrame|export default function|libro de reclamaciones|admision" apps/web/src/app/page.tsx apps/web/src/app/programas/page.tsx apps/web/src/app/programas/[slug]/page.tsx apps/web/src/app/institucion/page.tsx apps/web/src/app/admision/page.tsx apps/web/src/app/gestion-institucional/page.tsx apps/web/src/app/libro-de-reclamaciones/page.tsx -S`
Expected: matches proving the current-site sections used in the gap analysis.

- [ ] **Step 4: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md \
  docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md
git commit -m "docs: compare benchmark references and current cetpro site"
```

## Task 6: Write The Target Architecture And CRUD Model

**Files:**
- Create: `docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md`
- Create: `docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md`

- [ ] **Step 1: Write the target public architecture**

Use this concrete structure:

```md
# 03.01 - Arquitectura web objetivo CETPRO Cesar Vallejo

## Principios
- una sola sede actual
- maximo institucional
- CTA principal: preinscripcion simple por programa

## Navegacion principal
- Inicio
- Institucion
- Programas
- Admision
- Vida estudiantil
- Noticias
- Contacto

## Navegacion institucional obligatoria
- Nosotros
- Mision y vision
- Autoridades
- Convenios
- Gestion institucional
- Documentos y resoluciones
- Libro de reclamaciones
- Politica de privacidad

## Programas y admision
- catalogo de programas
- detalle por programa
- requisitos
- proceso de admision
- preguntas frecuentes
- preinscripcion
```

- [ ] **Step 2: Write the first-version CRUD model with fixed fields**

Use this structure:

```md
# 03.02 - Modelo CRUD publico CETPRO Cesar Vallejo

## Entidades gestionables
- programas
- fichas de programa
- heroes y banners
- paginas institucionales
- noticias
- FAQs
- documentos de compliance
- formularios
- testimonios
- galerias
- datos de sede y contacto

## Regla editorial
- estructura fija por pagina
- sin constructor libre
- bloques reutilizables solo donde este explicitamente definido

## Campos minimos por entidad
### Programa
- nombre
- slug
- resumen
- descripcion
- imagen principal
- duracion
- modalidad
- CTA de preinscripcion
```

- [ ] **Step 3: Self-check architecture against the approved spec**

Run: `rg -n "una sola sede|maximo institucional|preinscripcion|CRUD simple|compliance|vida estudiantil" docs/fase-1-analisis-requerimientos/01.02-benchmark-referencias-cetpro-arquitectura-web-objetivo.md docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md -S`
Expected: the architecture docs echo the approved scope markers.

- [ ] **Step 4: Commit**

```bash
git add docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md \
  docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md
git commit -m "docs: define target architecture and crud model for cetpro"
```

## Task 7: Derive The Prioritized Backlog And Phase Handoff

**Files:**
- Create: `docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md`
- Modify: `docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md`
- Modify: `AI_CONTEXT.md`
- Modify: `TRACEABILITY_MATRIX.md`
- Modify: `docs/README.md`

- [ ] **Step 1: Write the derived backlog as concrete work packages**

Use this exact table in `01.03-backlog-derivado-chg-swcv-001.md`:

```md
| ID | Frente | Resultado esperado | Fase siguiente | Prioridad |
| --- | --- | --- | --- | --- |
| CHG-SWCV-002 | UX home y navegacion | home, slider, carruseles y footer reordenados con IA clara | 4 | alta |
| CHG-SWCV-003 | Programas de estudio | fichas con fotos reales, sin superposicion de texto, CTA por programa | 4 | alta |
| CHG-SWCV-004 | Preinscripcion por programa | flujo simple con correo y registro trazable | 4 | alta |
| CHG-SWCV-005 | Compliance institucional | paginas y documentos base para evaluacion y confianza | 4 | alta |
| CHG-SWCV-006 | Modelo CRUD publico | administracion de contenido publico con estructura fija | 4 | media |
```

- [ ] **Step 2: Reflect the derived changes in the master backlog**

Append the new rows to `01.01-backlog-cambios-siguiente-iteracion.md` and keep `CHG-SWCV-001` as the benchmark parent item.

- [ ] **Step 3: Update repo entrypoints**

Add one short marker section in `AI_CONTEXT.md` and `TRACEABILITY_MATRIX.md`:

```md
## Cambio activo
- `CHG-SWCV-001`: benchmark CETPRO cerrado y derivado a backlog ejecutable.
```

Also link the derived backlog from `docs/README.md`.

- [ ] **Step 4: Verify the handoff markers**

Run: `rg -n "CHG-SWCV-001|CHG-SWCV-002|CHG-SWCV-003|CHG-SWCV-004|CHG-SWCV-005|CHG-SWCV-006" docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md AI_CONTEXT.md TRACEABILITY_MATRIX.md docs/README.md -S`
Expected: every change ID appears in both the detailed and top-level handoff docs.

- [ ] **Step 5: Commit**

```bash
git add docs/fase-1-analisis-requerimientos/01.01-backlog-cambios-siguiente-iteracion.md \
  docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md \
  AI_CONTEXT.md TRACEABILITY_MATRIX.md docs/README.md
git commit -m "docs: derive benchmark backlog and update handoff context"
```

## Task 8: Add A Governance Check For The Benchmark Package

**Files:**
- Create: `scripts/check-cetpro-benchmark.mjs`
- Create: `tests/governance/check-cetpro-benchmark.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing governance test first**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { validateCetproBenchmark } from "../../scripts/check-cetpro-benchmark.mjs";

test("validateCetproBenchmark reports missing benchmark artifacts", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "swcv-benchmark-"));

  const result = validateCetproBenchmark(rootDir);

  assert.equal(result.ok, false);
  assert.deepEqual(
    result.missingFiles,
    [
      "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/README.md",
      "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md",
      "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md",
      "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md",
      "docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md",
      "docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md",
      "docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md"
    ]
  );
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/governance/check-cetpro-benchmark.test.mjs`
Expected: FAIL because `validateCetproBenchmark` does not exist yet.

- [ ] **Step 3: Implement the validator and wire it into `package.json`**

```js
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REQUIRED_FILES = [
  "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/README.md",
  "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/00-universo-y-seleccion.md",
  "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/01-matriz-comparativa.md",
  "docs/fase-1-analisis-requerimientos/benchmark/chg-swcv-001/02-brecha-actual-vs-objetivo.md",
  "docs/fase-1-analisis-requerimientos/01.03-backlog-derivado-chg-swcv-001.md",
  "docs/fase-3-arquitectura/03.01-arquitectura-web-objetivo-cetpro-cv.md",
  "docs/fase-3-arquitectura/03.02-modelo-crud-publico-cetpro-cv.md"
];

export function validateCetproBenchmark(rootDir = process.cwd()) {
  const missingFiles = REQUIRED_FILES.filter(
    (relativePath) => !fs.existsSync(path.join(rootDir, relativePath)),
  );

  return {
    ok: missingFiles.length === 0,
    missingFiles,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateCetproBenchmark(process.cwd());
  if (result.ok) {
    console.log("CETPRO benchmark wiring OK");
  } else {
    console.error("Missing benchmark files:");
    for (const relativePath of result.missingFiles) {
      console.error(`- ${relativePath}`);
    }
    process.exitCode = 1;
  }
}
```

```json
{
  "scripts": {
    "check:benchmark-cetpro": "node --test tests/governance/check-cetpro-benchmark.test.mjs && node scripts/check-cetpro-benchmark.mjs",
    "check:project": "pnpm check:governance && node scripts/check-project-governance.mjs && pnpm check:sdd-backfill && pnpm check:qa-baseline && pnpm check:qa-backfill && pnpm check:release-evidence && pnpm check:release-smokes && pnpm check:benchmark-cetpro"
  }
}
```

- [ ] **Step 4: Run the benchmark test and the full project check**

Run: `node --test tests/governance/check-cetpro-benchmark.test.mjs`
Expected: PASS

Run: `pnpm check:project`
Expected: PASS including `check:benchmark-cetpro`

- [ ] **Step 5: Commit**

```bash
git add scripts/check-cetpro-benchmark.mjs \
  tests/governance/check-cetpro-benchmark.test.mjs \
  package.json
git commit -m "test: govern cetpro benchmark artifact package"
```

## Self-Review Checklist

- Spec coverage:
  - 5 references from official-filtered sources: covered by Tasks 2-4.
  - Dataset summarized for future BD: covered by Tasks 3-4.
  - Comparative benchmark and gap analysis: covered by Task 5.
  - Target architecture and CRUD model: covered by Task 6.
  - Prioritized downstream backlog: covered by Task 7.
  - Durable repo governance: covered by Task 8.
- Placeholder scan:
  - No `TODO`, `TBD`, or “implement later” markers should remain in the plan outputs.
- Type consistency:
  - Keep `siteId`, `pageId`, `flowType`, `assetType`, and `scores` naming exactly as written here across JSON and markdown references.
