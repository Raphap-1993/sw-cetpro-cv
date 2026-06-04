# CETPRO Public SEO + Contact CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve local SEO for CETPRO Cesar Vallejo, strengthen the four priority program pages, add a dedicated public contact route, and ship a global floating CTA that routes people to WhatsApp or the existing admissions form.

**Architecture:** Keep the API as the source of truth for page SEO by exposing a safe public read endpoint for page-level metadata already managed in the backoffice. In the web app, centralize metadata composition in one server-only helper, reuse the existing `LeadForm` and `page-content` fallbacks for the new `/contacto` route, and mount the floating CTA once at the `PublicSiteFrame` level so every public route inherits the same contact behavior.

**Tech Stack:** NestJS, Prisma, Next.js App Router, React, TypeScript, Metadata routes (`robots.ts`, `sitemap.ts`), existing public smoke scripts, pnpm.

---

## File Structure

### Create
- `apps/web/src/lib/public-seo.ts`
- `apps/web/src/app/contacto/page.tsx`
- `apps/web/src/app/components/PublicContactCta.tsx`
- `apps/web/src/app/sitemap.ts`

### Modify
- `apps/api/src/seo/seo.controller.ts`
- `apps/api/src/seo/seo.service.ts`
- `apps/api/src/seo/seo.service.test.ts`
- `apps/web/src/lib/public-data.ts`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/admision/page.tsx`
- `apps/web/src/app/institucion/page.tsx`
- `apps/web/src/app/programas/page.tsx`
- `apps/web/src/app/programas/[slug]/page.tsx`
- `apps/web/src/app/gestion-institucional/page.tsx`
- `apps/web/src/app/libro-de-reclamaciones/page.tsx`
- `apps/web/src/app/components/PublicSiteFrame.tsx`
- `apps/web/src/app/page-content.ts`
- `apps/web/src/app/programas/content.ts`
- `apps/web/src/app/public-site.ts`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/admin/(protected)/publico/seo/page.tsx`
- `apps/web/src/app/admin/actions.ts`
- `ops/bin/smoke-public.sh`
- `.env.example`
- `README.md`

### Test / Verification Targets
- `apps/api/src/seo/seo.service.test.ts`
- `ops/bin/smoke-public.sh`
- `pnpm --filter @swcv/api typecheck`
- `pnpm --filter @swcv/web lint`
- `pnpm --filter @swcv/web typecheck`
- `pnpm --filter @swcv/web build`
- `pnpm deploy:smoke:public`

---

### Task 1: Expose public page SEO and centralize metadata composition

**Files:**
- Modify: `apps/api/src/seo/seo.controller.ts`
- Modify: `apps/api/src/seo/seo.service.ts`
- Modify: `apps/api/src/seo/seo.service.test.ts`
- Modify: `apps/web/src/lib/public-data.ts`
- Create: `apps/web/src/lib/public-seo.ts`

- [ ] **Step 1: Extend the failing API test for public SEO reads**

Add a second assertion to `apps/api/src/seo/seo.service.test.ts` so the service must support `findPublicByPageKey`:

```ts
test("seo service returns a public record by page key", async () => {
  let findUniqueArgs: unknown = null;
  const prisma = {
    pageSeo: {
      findUnique: async (args: unknown) => {
        findUniqueArgs = args;
        return { id: "seo-home", pageKey: "home", title: "Inicio", description: "Desc" };
      }
    }
  } as any;

  const service = new SeoService(prisma);
  const result = await service.findPublicByPageKey("home");

  assert.equal(result?.pageKey, "home");
  assert.deepEqual((findUniqueArgs as { where: { pageKey: string } }).where, {
    pageKey: "home"
  });
});
```

- [ ] **Step 2: Run the API test to verify the new contract fails first**

Run:

```bash
pnpm --filter @swcv/api exec node --import tsx --test src/seo/seo.service.test.ts
```

Expected: the suite fails because `findPublicByPageKey` does not exist yet.

- [ ] **Step 3: Implement the public API read and the web-side metadata helper**

Expose a safe read endpoint in `apps/api/src/seo/seo.controller.ts`:

```ts
@Public()
@Get("public/:pageKey")
findPublicByPageKey(@Param("pageKey") pageKey: string) {
  return this.seoService.findPublicByPageKey(pageKey);
}
```

Add the service method in `apps/api/src/seo/seo.service.ts`:

```ts
findPublicByPageKey(pageKey: string) {
  return this.prisma.pageSeo.findUnique({
    where: { pageKey }
  });
}
```

In `apps/web/src/lib/public-data.ts`, add the public type and fetcher:

```ts
export type PublicPageSeo = {
  pageKey: string;
  title: string;
  description: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

export async function getPublicPageSeo(pageKey: string) {
  return requestPublicJson<PublicPageSeo>(`/seo/public/${encodeURIComponent(pageKey)}`);
}
```

Create `apps/web/src/lib/public-seo.ts` as the server-only metadata composer:

```ts
import "server-only";
import type { Metadata } from "next";
import { getPublicPageSeo } from "@/lib/public-data";

type PageMetadataInput = {
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
  canonicalPath: string;
  fallbackOgImageUrl?: string | null;
};

export async function buildPageMetadata(input: PageMetadataInput): Promise<Metadata> {
  const seo = await getPublicPageSeo(input.pageKey);
  const title = seo?.title ?? input.fallbackTitle;
  const description = seo?.description ?? input.fallbackDescription;
  const canonical = seo?.canonicalUrl ?? input.canonicalPath;
  const ogTitle = seo?.ogTitle ?? title;
  const ogDescription = seo?.ogDescription ?? description;
  const ogImage = seo?.ogImageUrl ?? input.fallbackOgImageUrl ?? undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}
```

- [ ] **Step 4: Re-run the API test and web typecheck**

Run:

```bash
pnpm --filter @swcv/api exec node --import tsx --test src/seo/seo.service.test.ts
pnpm --filter @swcv/web typecheck
```

Expected: the API test passes and the web typecheck passes with the new helper.

- [ ] **Step 5: Commit the SEO data-read foundation**

```bash
git add apps/api/src/seo/seo.controller.ts apps/api/src/seo/seo.service.ts apps/api/src/seo/seo.service.test.ts apps/web/src/lib/public-data.ts apps/web/src/lib/public-seo.ts
git commit -m "feat: expose public page seo metadata"
```

---

### Task 2: Create `/contacto` and tighten local copy plus internal linking

**Files:**
- Create: `apps/web/src/app/contacto/page.tsx`
- Modify: `apps/web/src/app/page-content.ts`
- Modify: `apps/web/src/app/programas/content.ts`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/institucion/page.tsx`
- Modify: `apps/web/src/app/admision/page.tsx`
- Modify: `apps/web/src/app/programas/page.tsx`
- Modify: `apps/web/src/app/programas/[slug]/page.tsx`
- Modify: `apps/web/src/app/public-site.ts`
- Modify: `apps/web/src/app/components/PublicSiteFrame.tsx`
- Modify: `apps/web/src/app/admin/(protected)/publico/seo/page.tsx`
- Modify: `apps/web/src/app/admin/actions.ts`

- [ ] **Step 1: Add the `contacto` content fallback and SEO key**

Extend `apps/web/src/app/page-content.ts` with a new `contacto` entry:

```ts
contacto: {
  seo: {
    title: "Contacto | CETPRO Cesar Vallejo de Pucallpa",
    body:
      "Escríbenos por WhatsApp o déjanos tus datos para recibir orientación sobre carreras técnicas presenciales en Pucallpa, Ucayali.",
    mediaUrl: null
  },
  "hero-eyebrow": { title: "Contacto", body: "", mediaUrl: null },
  "hero-main": {
    title: "Estamos para orientarte sobre programas, vacantes y admisión.",
    body: "",
    mediaUrl: null
  },
  "hero-body": {
    title: "",
    body:
      "Si tienes dudas sobre una carrera o quieres saber cómo postular, puedes escribirnos por WhatsApp o dejarnos tus datos para comunicarnos contigo.",
    mediaUrl: null
  },
  "hero-note": {
    title: "Atención inicial",
    body: "Pucallpa, Ucayali · orientación para estudiantes y familias",
    mediaUrl: null
  },
  "section-main": {
    title: "Canales de atención",
    body:
      "Elige el canal que te resulte más cómodo para resolver dudas sobre carreras, horarios, vacantes o proceso de admisión.",
    mediaUrl: null
  },
  "section-secondary": {
    title: "Qué puedes consultar",
    body:
      "Podemos orientarte sobre programas presenciales, requisitos, turnos y el siguiente paso para iniciar tu proceso.",
    mediaUrl: null
  },
  "cta-primary": { title: "Ver programas", body: "", mediaUrl: null },
  "cta-secondary": { title: "Ir a admisión", body: "", mediaUrl: null }
}
```

- [ ] **Step 2: Build the new public route around the existing `LeadForm`**

Create `apps/web/src/app/contacto/page.tsx` reusing the same data primitives as admissions:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { LeadForm } from "@/app/components/LeadForm";
import { getPageContent } from "@/app/page-content";
import { buildPageMetadata } from "@/lib/public-seo";
import { getPublicWhatsAppHref, institutionAddress } from "@/app/public-site";
import { listPublishedPrograms } from "@/app/programas/programs";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contacto");
  return buildPageMetadata({
    pageKey: "contacto",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: "/contacto"
  });
}
```

Keep the page simple:
- hero copy for students, parents, and the general public;
- one WhatsApp button if configured;
- the existing `LeadForm`;
- links back to `/programas` and `/admision`.

- [ ] **Step 3: Point the public site toward `contacto` as the general help route**

In `apps/web/src/app/public-site.ts`, add the shared route and WhatsApp helper:

```ts
export const publicContactHref = "/contacto";

export function getPublicWhatsAppHref() {
  const value = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  return value ? value : null;
}
```

In `apps/web/src/app/components/PublicSiteFrame.tsx`, change the default contact destination:

```tsx
contactHref = publicContactHref
```

In `apps/web/src/app/admin/(protected)/publico/seo/page.tsx`, add the SEO key:

```ts
{ key: "contacto", label: "Contacto" }
```

In `apps/web/src/app/admin/actions.ts`, add revalidation for the new page key:

```ts
if (normalized === "contacto") {
  revalidatePath("/contacto");
  return;
}
```

- [ ] **Step 4: Tighten local copy and cross-links on priority public pages**

Update the public pages so they speak more directly to Pucallpa/Ucayali intent and link to the new help route:

```tsx
<p>
  Conoce carreras técnicas presenciales en Pucallpa, Ucayali, revisa cuál se ajusta mejor a tu interés y recibe orientación por WhatsApp o desde nuestro formulario.
</p>
```

Apply this in:
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/institucion/page.tsx`
- `apps/web/src/app/admision/page.tsx`
- `apps/web/src/app/programas/page.tsx`
- `apps/web/src/app/programas/[slug]/page.tsx`
- `apps/web/src/app/programas/content.ts`

Minimum linking outcome:
- home links to `/programas`, `/admision`, `/contacto`;
- program detail links to `/admision` and `/contacto`;
- institution links to `/programas` and `/contacto`.

- [ ] **Step 5: Run the web quality gate for the new route and copy**

Run:

```bash
pnpm --filter @swcv/web lint
pnpm --filter @swcv/web typecheck
pnpm --filter @swcv/web build
```

Expected: all three commands pass and `/contacto` is part of the built app.

- [ ] **Step 6: Commit the public contact route and copy foundation**

```bash
git add apps/web/src/app/contacto/page.tsx apps/web/src/app/page-content.ts apps/web/src/app/programas/content.ts apps/web/src/app/page.tsx apps/web/src/app/institucion/page.tsx apps/web/src/app/admision/page.tsx apps/web/src/app/programas/page.tsx 'apps/web/src/app/programas/[slug]/page.tsx' apps/web/src/app/public-site.ts apps/web/src/app/components/PublicSiteFrame.tsx 'apps/web/src/app/admin/(protected)/publico/seo/page.tsx' apps/web/src/app/admin/actions.ts
git commit -m "feat: add public contact route and local copy improvements"
```

---

### Task 3: Wire metadata, robots, sitemap, and institutional structured data

**Files:**
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/robots.ts`
- Create: `apps/web/src/app/sitemap.ts`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/admision/page.tsx`
- Modify: `apps/web/src/app/institucion/page.tsx`
- Modify: `apps/web/src/app/programas/page.tsx`
- Modify: `apps/web/src/app/programas/[slug]/page.tsx`
- Modify: `apps/web/src/app/gestion-institucional/page.tsx`
- Modify: `apps/web/src/app/libro-de-reclamaciones/page.tsx`
- Modify: `apps/web/src/app/contacto/page.tsx`

- [ ] **Step 1: Replace duplicated page metadata with the shared builder**

Refactor each public route to call `buildPageMetadata(...)` instead of returning ad-hoc metadata objects. Example for `apps/web/src/app/programas/page.tsx`:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const content = await getProgramsCatalogContent();
  return buildPageMetadata({
    pageKey: "programas",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: "/programas"
  });
}
```

Use page keys:
- `home`
- `institucion`
- `admision`
- `programas`
- `program-detail`
- `gestion-institucional`
- `libro-de-reclamaciones`
- `contacto`

- [ ] **Step 2: Add `metadataBase` and `EducationalOrganization` JSON-LD in the root layout**

Update `apps/web/src/app/layout.tsx`:

```tsx
function getMetadataBase() {
  const origin = process.env.WEB_ORIGIN?.split(",")[0]?.trim();
  return origin ? new URL(origin) : undefined;
}

function buildEducationalOrganizationJsonLd(siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteName,
    url: "/",
    address: {
      "@type": "PostalAddress",
      streetAddress: institutionAddress,
      addressLocality: "Pucallpa",
      addressRegion: "Ucayali",
      addressCountry: "PE"
    },
    areaServed: ["Pucallpa", "Ucayali", "Peru"]
  };
}
```

Render the JSON-LD script in `<body>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(buildEducationalOrganizationJsonLd(siteContent["default-title"].title))
  }}
/>
```

- [ ] **Step 3: Add a real sitemap and enrich `robots.ts`**

Create `apps/web/src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { managementDocuments } from "@/app/public-site";
import { listPublishedPrograms } from "@/app/programas/programs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await listPublishedPrograms();

  return [
    { url: "/", changeFrequency: "weekly", priority: 1 },
    { url: "/institucion", changeFrequency: "monthly", priority: 0.8 },
    { url: "/programas", changeFrequency: "weekly", priority: 0.9 },
    { url: "/admision", changeFrequency: "weekly", priority: 0.9 },
    { url: "/contacto", changeFrequency: "weekly", priority: 0.8 },
    ...programs.map((program) => ({
      url: `/programas/${program.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...managementDocuments.map((document) => ({
      url: `/gestion-institucional/${document.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
```

Update `apps/web/src/app/robots.ts`:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${process.env.WEB_ORIGIN?.split(",")[0]?.trim() ?? ""}/sitemap.xml`
  };
}
```

- [ ] **Step 4: Rebuild the web app and check the generated routes**

Run:

```bash
pnpm --filter @swcv/web build
curl -fsS http://127.0.0.1:3010/robots.txt
curl -fsS http://127.0.0.1:3010/sitemap.xml
```

Expected:
- build passes;
- `robots.txt` includes `Sitemap:`;
- `sitemap.xml` lists `/contacto` and the published program slugs.

- [ ] **Step 5: Commit the metadata and crawlability layer**

```bash
git add apps/web/src/app/layout.tsx apps/web/src/app/robots.ts apps/web/src/app/sitemap.ts apps/web/src/app/page.tsx apps/web/src/app/admision/page.tsx apps/web/src/app/institucion/page.tsx apps/web/src/app/programas/page.tsx 'apps/web/src/app/programas/[slug]/page.tsx' apps/web/src/app/gestion-institucional/page.tsx apps/web/src/app/libro-de-reclamaciones/page.tsx apps/web/src/app/contacto/page.tsx
git commit -m "feat: wire public metadata and sitemap"
```

---

### Task 4: Add the floating CTA, WhatsApp config, and smoke coverage

**Files:**
- Create: `apps/web/src/app/components/PublicContactCta.tsx`
- Modify: `apps/web/src/app/components/PublicSiteFrame.tsx`
- Modify: `apps/web/src/app/public-site.ts`
- Modify: `apps/web/src/app/globals.css`
- Modify: `ops/bin/smoke-public.sh`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Add the env-backed CTA configuration**

Document the new variable in `.env.example`:

```env
NEXT_PUBLIC_WHATSAPP_URL="https://wa.me/51999999999?text=Hola%2C%20quiero%20informacion%20sobre%20las%20carreras%20del%20CETPRO"
```

Add the helper in `apps/web/src/app/public-site.ts` if it is not already present:

```ts
export function getPublicWhatsAppHref() {
  const value = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  return value ? value : null;
}
```

- [ ] **Step 2: Implement the floating CTA component**

Create `apps/web/src/app/components/PublicContactCta.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export function PublicContactCta({
  contactHref,
  whatsappHref
}: {
  contactHref: string;
  whatsappHref: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`publicContactCta ${isOpen ? "isOpen" : ""}`}>
      <button
        aria-expanded={isOpen}
        className="publicContactCtaTrigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        ¿Necesitas orientación?
      </button>

      <div className="publicContactCtaPanel">
        <p>Si tienes dudas sobre una carrera, podemos orientarte.</p>
        {whatsappHref ? (
          <a href={whatsappHref} rel="noreferrer" target="_blank">
            Escríbenos por WhatsApp
          </a>
        ) : null}
        <Link href={contactHref}>Déjanos tus datos y te orientamos</Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Mount the CTA once in the public shell and style it globally**

Render it in `apps/web/src/app/components/PublicSiteFrame.tsx`:

```tsx
<PublicContactCta
  contactHref={contactHref}
  whatsappHref={getPublicWhatsAppHref() ?? null}
/>
```

Add the global styles in `apps/web/src/app/globals.css`:

```css
.publicContactCta {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 40;
}

.publicContactCtaPanel {
  display: grid;
  gap: 0.75rem;
  width: min(20rem, calc(100vw - 2rem));
}

@media (prefers-reduced-motion: reduce) {
  .publicContactCta,
  .publicContactCtaPanel {
    transition: none;
  }
}
```

Keep the CTA clear of the mobile menu and footer by using the existing public spacing scale instead of arbitrary pixel offsets.

- [ ] **Step 4: Extend the public smoke to cover SEO + contact**

Update `ops/bin/smoke-public.sh` to fetch and assert:

```bash
contact_file="$(mktemp)"
robots_file="$(mktemp)"
sitemap_file="$(mktemp)"

curl -fsS "$WEB_BASE/contacto" > "$contact_file"
curl -fsS "$WEB_BASE/robots.txt" > "$robots_file"
curl -fsS "$WEB_BASE/sitemap.xml" > "$sitemap_file"

node - "$home_file" "$detail_file" "$contact_file" "$robots_file" "$sitemap_file" <<'EOF'
const fs = require("node:fs");
const homeHtml = fs.readFileSync(process.argv[2], "utf8");
const detailHtml = fs.readFileSync(process.argv[3], "utf8");
const contactHtml = fs.readFileSync(process.argv[4], "utf8");
const robots = fs.readFileSync(process.argv[5], "utf8");
const sitemap = fs.readFileSync(process.argv[6], "utf8");

if (!/¿Necesitas orientación\\?|Escr[ií]benos por WhatsApp|Déjanos tus datos y te orientamos/i.test(homeHtml + detailHtml + contactHtml)) {
  throw new Error("Public contact CTA copy is missing from the public HTML");
}

if (!/Sitemap:/i.test(robots)) {
  throw new Error("robots.txt does not reference sitemap.xml");
}

if (!/\\/contacto/.test(sitemap)) {
  throw new Error("sitemap.xml is missing /contacto");
}
EOF
```

- [ ] **Step 5: Run the final verification set**

Run:

```bash
pnpm --filter @swcv/web lint
pnpm --filter @swcv/web typecheck
pnpm --filter @swcv/web build
pnpm deploy:smoke:public
```

Expected:
- lint, typecheck, and build pass;
- the smoke verifies home, program detail, `/contacto`, `robots.txt`, and `sitemap.xml`;
- the CTA labels are present in the rendered HTML.

- [ ] **Step 6: Commit the floating CTA and smoke coverage**

```bash
git add apps/web/src/app/components/PublicContactCta.tsx apps/web/src/app/components/PublicSiteFrame.tsx apps/web/src/app/public-site.ts apps/web/src/app/globals.css ops/bin/smoke-public.sh .env.example README.md
git commit -m "feat: add public contact cta and seo smoke coverage"
```

---

## Self-Review

### Spec coverage
- Local brand SEO: covered by Tasks 2 and 3.
- Program-page strengthening for the four priority careers: covered by Task 2 plus Task 3 metadata wiring.
- Public contact CTA with WhatsApp and form: covered by Task 4.
- Reuse of existing backoffice SEO instead of inventing a new CMS: covered by Task 1.
- Event readiness without implementing the full module: preserved by Tasks 2 and 3 through route/linking cleanup and sitemap discipline, without adding fake event pages.

### Placeholder scan
- No `TBD`, `TODO`, or “implement later” markers remain.
- Commands, file paths, and page keys are explicit.
- The plan avoids vague “add validation” language and instead names the exact checks and smoke assertions.

### Type consistency
- Page SEO uses the existing `PageSeo` shape from the API.
- Public route keys stay consistent across admin SEO, metadata helper, and revalidation:
  `home`, `institucion`, `admision`, `programas`, `program-detail`, `gestion-institucional`, `libro-de-reclamaciones`, `contacto`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-04-cetpro-public-seo-contact.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
