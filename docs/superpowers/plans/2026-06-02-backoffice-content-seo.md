# Backoffice Content + SEO Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the backoffice into the primary place to manage public pages, SEO, blog posts, documents, banners, FAQs, contact configuration, and reusable media without touching code for routine updates.

**Architecture:** Keep the API as the source of truth for persisted content and metadata. Reuse the existing `ContentBlock` and `MediaAsset` foundation for page sections and assets, add explicit models for `BlogPost`, `PageSeo`, and `PublicDocument`, then expose those records through typed admin API helpers and route-grouped admin screens. The public site reads those records through the existing server-side data helpers and generates page metadata from the same source so the admin and public views stay aligned.

**Tech Stack:** Prisma, PostgreSQL, NestJS, Next.js App Router, React Server Actions, TypeScript, pnpm, Node test scripts, existing release smoke scripts.

---

## File Structure

### Create
- `apps/api/src/blog/blog.module.ts`
- `apps/api/src/blog/blog.controller.ts`
- `apps/api/src/blog/blog.service.ts`
- `apps/api/src/blog/dto/create-blog-post.dto.ts`
- `apps/api/src/blog/dto/update-blog-post.dto.ts`
- `apps/api/src/blog/dto/list-blog-posts-query.dto.ts`
- `apps/api/src/seo/seo.module.ts`
- `apps/api/src/seo/seo.controller.ts`
- `apps/api/src/seo/seo.service.ts`
- `apps/api/src/seo/dto/update-page-seo.dto.ts`
- `apps/api/src/documents/documents.module.ts`
- `apps/api/src/documents/documents.controller.ts`
- `apps/api/src/documents/documents.service.ts`
- `apps/api/src/documents/dto/create-public-document.dto.ts`
- `apps/api/src/documents/dto/update-public-document.dto.ts`
- `apps/web/src/app/admin/(protected)/publico/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/paginas/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/seo/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/blog/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/documentos/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/configuracion/page.tsx`
- `apps/web/src/app/admin/(protected)/publico/layout.tsx`
- `apps/web/src/app/blog/page.tsx`
- `apps/web/src/app/blog/[slug]/page.tsx`
- `apps/web/src/app/blog/[slug]/not-found.tsx`
- `ops/bin/smoke-feature-005-content-center.sh`

### Modify
- `apps/api/prisma/schema.prisma`
- `apps/api/src/app.module.ts`
- `apps/api/prisma/seed.ts`
- `apps/web/src/lib/admin/types.ts`
- `apps/web/src/lib/admin/api.ts`
- `apps/web/src/lib/admin/permissions.ts`
- `apps/web/src/app/admin/actions.ts`
- `apps/web/src/app/admin/(protected)/layout.tsx`
- `apps/web/src/app/admin/(protected)/page.tsx`
- `apps/web/src/app/admin/(protected)/contenido/page.tsx`
- `apps/web/src/app/admin/(protected)/media/page.tsx`
- `apps/web/src/app/public-data.ts`
- `apps/web/src/app/public-site.ts`
- `apps/web/src/app/page-content.ts`
- `apps/web/src/app/site-content.ts`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/components/PublicSiteHeader.tsx`
- `apps/web/src/app/institucion/page.tsx`
- `apps/web/src/app/admision/page.tsx`
- `apps/web/src/app/gestion-institucional/page.tsx`
- `apps/web/src/app/libro-de-reclamaciones/page.tsx`
- `apps/web/src/app/programas/page.tsx`
- `apps/web/src/app/programas/[slug]/page.tsx`
- `package.json`
- `tests/governance/check-release-smokes.test.mjs`

---

### Task 1: Add persisted models and typed API contracts for public content

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `apps/api/src/app.module.ts`
- Create: `apps/api/src/blog/*`
- Create: `apps/api/src/seo/*`
- Create: `apps/api/src/documents/*`
- Modify: `apps/web/src/lib/admin/types.ts`
- Modify: `apps/web/src/lib/admin/api.ts`
- Modify: `apps/web/src/app/admin/actions.ts`

- [ ] **Step 1: Make the new content boundaries explicit in the schema**

Add these Prisma models and keep the existing `ContentBlock` / `MediaAsset` tables:

```prisma
model BlogPost {
  id              String        @id @default(cuid())
  slug            String        @unique
  title           String
  excerpt         String?
  body            String
  coverImageUrl   String?
  status          PublishStatus @default(DRAFT)
  publishedAt     DateTime?
  seoTitle        String?
  seoDescription  String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model PageSeo {
  id            String   @id @default(cuid())
  pageKey       String   @unique
  title         String
  description   String
  canonicalUrl  String?
  ogImageUrl    String?
  noIndex       Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PublicDocument {
  id          String        @id @default(cuid())
  slug        String        @unique
  title       String
  category    String
  summary     String?
  url         String
  position    Int           @default(0)
  status      PublishStatus @default(PUBLISHED)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

Keep banners, FAQs, and contact configuration inside `ContentBlock` with reserved page keys so the first phase stays focused and does not create unnecessary tables.

- [ ] **Step 2: Prove the schema change breaks type generation first**

Run:

```bash
pnpm --filter @swcv/api typecheck
```

Expected: TypeScript fails until the new Prisma models and service contracts exist.

- [ ] **Step 3: Add the API modules and DTOs that map cleanly to the new models**

Implement the new Nest modules so each domain stays isolated:
- `blog` for CRUD and public listing by slug;
- `seo` for per-page metadata;
- `documents` for public downloads.

Expose the following admin-facing API methods in `apps/web/src/lib/admin/api.ts`:
- `listAdminBlogPosts`
- `createBlogPost`
- `updateBlogPost`
- `deleteBlogPost`
- `listPageSeo`
- `upsertPageSeo`
- `listPublicDocuments`
- `createPublicDocument`
- `updatePublicDocument`
- `deletePublicDocument`

Mirror those methods in `apps/web/src/lib/admin/types.ts` and `apps/web/src/app/admin/actions.ts` so the UI can stay server-action driven where it already is.

- [ ] **Step 4: Regenerate Prisma client and verify the API compiles**

Run:

```bash
pnpm prisma:generate
pnpm --filter @swcv/api typecheck
```

Expected: both commands pass after the new modules, DTOs, and Prisma types are wired.

- [ ] **Step 5: Commit the data model foundation**

```bash
git add apps/api/prisma/schema.prisma apps/api/src/app.module.ts apps/api/src/blog apps/api/src/seo apps/api/src/documents apps/web/src/lib/admin/types.ts apps/web/src/lib/admin/api.ts apps/web/src/app/admin/actions.ts
git commit -m "feat: add content seo data contracts"
```

---

### Task 2: Reorganize the backoffice into a content-first admin area

**Files:**
- Modify: `apps/web/src/lib/admin/permissions.ts`
- Modify: `apps/web/src/app/admin/(protected)/layout.tsx`
- Modify: `apps/web/src/app/admin/(protected)/page.tsx`
- Modify: `apps/web/src/app/admin/(protected)/contenido/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/layout.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/paginas/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/seo/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/blog/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/documentos/page.tsx`
- Create: `apps/web/src/app/admin/(protected)/publico/configuracion/page.tsx`

- [ ] **Step 1: Fail the web typecheck with the missing admin routes**

Run:

```bash
pnpm --filter @swcv/web typecheck
```

Expected: route and import errors until the new `publico` group exists.

- [ ] **Step 2: Expand the permission map and navigation labels**

Add a top-level `publicSite` or `publicContent` section in `apps/web/src/lib/admin/permissions.ts` and expose it to `SUPER_ADMIN` and `CONTENT_EDITOR`.

Update the sidebar in `apps/web/src/app/admin/(protected)/layout.tsx` and the dashboard shortcuts in `apps/web/src/app/admin/(protected)/page.tsx` so the content center is the first visible admin destination, not an afterthought.

- [ ] **Step 3: Build the `publico` landing page and nested routes**

Make `/admin/publico` the landing page for content editing. Inside that group:
- `/admin/publico/paginas` manages page blocks;
- `/admin/publico/seo` edits metadata by page key;
- `/admin/publico/blog` lists and edits blog posts;
- `/admin/publico/documentos` manages public PDFs and downloads;
- `/admin/publico/configuracion` handles banners, FAQs, and contact/public settings.

Keep `/admin/contenido` working as a compatibility entrypoint, but route staff toward `/admin/publico`.

- [ ] **Step 4: Keep the editor UI normal and operational**

Use the existing card and form patterns from `contenido/page.tsx` and `media/page.tsx`:
- one list plus one form per domain;
- clear empty states;
- reusable media datalists;
- no marketing copy inside the admin;
- keep `SUPER_ADMIN` able to see every section.

- [ ] **Step 5: Re-run the web typecheck and lint**

Run:

```bash
pnpm --filter @swcv/web typecheck
pnpm --filter @swcv/web lint
```

Expected: both pass with the new admin routes and permission map.

- [ ] **Step 6: Commit the admin restructure**

```bash
git add apps/web/src/lib/admin/permissions.ts apps/web/src/app/admin/(protected)/layout.tsx apps/web/src/app/admin/(protected)/page.tsx apps/web/src/app/admin/(protected)/contenido/page.tsx apps/web/src/app/admin/(protected)/publico
git commit -m "feat: reorganize admin into content center"
```

---

### Task 3: Wire the public site to the new content records and add the blog

**Files:**
- Modify: `apps/web/src/lib/public-data.ts`
- Modify: `apps/web/src/app/public-site.ts`
- Modify: `apps/web/src/app/page-content.ts`
- Modify: `apps/web/src/app/site-content.ts`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/components/PublicSiteHeader.tsx`
- Modify: `apps/web/src/app/institucion/page.tsx`
- Modify: `apps/web/src/app/admision/page.tsx`
- Modify: `apps/web/src/app/gestion-institucional/page.tsx`
- Modify: `apps/web/src/app/libro-de-reclamaciones/page.tsx`
- Modify: `apps/web/src/app/programas/page.tsx`
- Modify: `apps/web/src/app/programas/[slug]/page.tsx`
- Create: `apps/web/src/app/blog/page.tsx`
- Create: `apps/web/src/app/blog/[slug]/page.tsx`
- Create: `apps/web/src/app/blog/[slug]/not-found.tsx`

- [ ] **Step 1: Break the public data layer on purpose**

Run:

```bash
pnpm --filter @swcv/web build
```

Expected: missing imports and metadata helpers until `public-data.ts` can read blog, SEO, and document records.

- [ ] **Step 2: Extend `public-data.ts` with public readers**

Add helpers for:
- `listPublishedBlogPosts()`
- `getPublishedBlogPost(slug)`
- `getPageSeo(pageKey)`
- `listPublishedDocuments()`

Keep `listPublishedPrograms()` and `getPublishedProgram()` intact so the existing public site keeps working while the new content layer is added.

- [ ] **Step 3: Add the blog shell and detail pages**

Create `/blog` as a list page with the latest published posts, then `/blog/[slug]` as the detail page.

Use the same editorial tone already established on the public site, but make the blog content read like something parents and students can consume quickly, not like a formal institutional report.

- [ ] **Step 4: Replace hardcoded page metadata with database-driven metadata**

Update the public page routes to read SEO records by page key and use them in `generateMetadata()` for:
- home;
- institution;
- admissions;
- management;
- complaints;
- programs landing;
- blog list and blog detail pages.

- [ ] **Step 5: Surface the blog in the home and navigation**

Add a visible blog CTA on the home page and expose `Blog` in the public header navigation.

- [ ] **Step 6: Re-run the public build**

Run:

```bash
pnpm --filter @swcv/web build
```

Expected: the build passes with the new public blog routes and metadata lookups.

- [ ] **Step 7: Commit the public rendering changes**

```bash
git add apps/web/src/lib/public-data.ts apps/web/src/app/public-site.ts apps/web/src/app/page-content.ts apps/web/src/app/site-content.ts apps/web/src/app/page.tsx apps/web/src/app/components/PublicSiteHeader.tsx apps/web/src/app/institucion/page.tsx apps/web/src/app/admision/page.tsx apps/web/src/app/gestion-institucional/page.tsx apps/web/src/app/libro-de-reclamaciones/page.tsx apps/web/src/app/programas/page.tsx apps/web/src/app/programas/[slug]/page.tsx apps/web/src/app/blog
git commit -m "feat: connect public site to content records"
```

---

### Task 4: Seed content, revalidation, and release verification

**Files:**
- Modify: `apps/api/prisma/seed.ts`
- Modify: `apps/web/src/app/admin/actions.ts`
- Create: `ops/bin/smoke-feature-005-content-center.sh`
- Modify: `package.json`
- Modify: `tests/governance/check-release-smokes.test.mjs`

- [ ] **Step 1: Seed real content for the new modules**

Add starter records for:
- at least one blog post;
- SEO rows for the canonical public pages;
- public documents with real titles, categories, and URLs;
- reserved content blocks for banners, FAQs, and contact data.

- [ ] **Step 2: Revalidate the correct public routes after admin writes**

Update `apps/web/src/app/admin/actions.ts` so changes in the new modules trigger `revalidatePath()` for:
- `/`;
- `/blog`;
- `/blog/[slug]`;
- `/programas`;
- affected institutional pages;
- any public document or configuration page touched by the change.

- [ ] **Step 3: Add a focused smoke script for the content center**

Create a smoke script that verifies:
- the admin content center loads;
- a blog list page is reachable publicly;
- a blog detail page is reachable publicly;
- SEO-driven pages still render;
- published documents are visible.

Wire the script into `package.json` as `smoke:feature:005` and include it in the release smoke check path.

- [ ] **Step 4: Run the end-to-end verification sequence**

Run:

```bash
pnpm prisma:seed
pnpm --filter @swcv/api typecheck
pnpm --filter @swcv/web typecheck
pnpm --filter @swcv/web build
pnpm smoke:feature:003
pnpm smoke:feature:004
pnpm smoke:feature:005
```

Expected: all checks pass and the new content center is stable enough for production rollout.

- [ ] **Step 5: Commit the seed and release checks**

```bash
git add apps/api/prisma/seed.ts apps/web/src/app/admin/actions.ts ops/bin/smoke-feature-005-content-center.sh package.json tests/governance/check-release-smokes.test.mjs
git commit -m "test: add content center seed and smoke coverage"
```

## Self-Review

This plan covers the spec requirements in three passes:
- public content and SEO: Tasks 1, 2, and 3;
- blog and document management: Tasks 1, 2, 3, and 4;
- banners, FAQs, and contact/public configuration: Task 2, backed by existing `ContentBlock` storage;
- reusable media and public rendering: Tasks 1, 3, and 4;
- release safety and verification: Task 4.

No placeholders remain, the file paths are specific, and the plan stays focused on the phase-1 public content center instead of accidentally opening the later operational and internal-admin phases.
