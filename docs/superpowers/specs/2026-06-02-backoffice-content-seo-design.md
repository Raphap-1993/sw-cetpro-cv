# Backoffice Content + SEO Center

**Status:** Draft pending user review  
**Scope:** Phase 1 of the expanded backoffice  
**Owners by roster:** `Aether` for content/SEO, `Neon` for implementation UI, `Vulcan` for data and persistence, `Delta` for documentation, `Echo` for QA

## Goal

Turn the backoffice into the primary place where the team manages all public-facing content without touching code for routine updates.

The first phase focuses on:
- public pages and their editable blocks;
- SEO metadata by page;
- blog publishing;
- media library for images, PDFs, and reusable assets;
- institutional documents and public downloads;
- banners, FAQs, and contact/public configuration.

This phase is intentionally content-first. Operational modules such as leads, pre-enrollments, academic workflows, and internal admin controls remain in scope for later phases.

## Why this phase first

The current backoffice already has the core admin shell, authentication, roles, and a few content-oriented screens. What is missing is a single, coherent content center where non-technical staff can manage the public site end to end.

This phase reduces friction for daily edits and makes the site maintainable by the people who actually publish it.

## Recommended Approach

### Option A: Expand existing screens one by one
Keep the current navigation and add fields as needed to each existing page.

Trade-off:
- faster to start;
- but the admin keeps feeling fragmented and hard to teach.

### Option B: Build a content-first admin area
Create a dedicated content center inside the backoffice with grouped modules, shared patterns, and clear ownership of public-facing data.

Trade-off:
- slightly more upfront structure;
- but better long-term clarity and easier training.

### Option C: Full CMS rewrite
Replace the current content screens with a larger system modeled like a CMS.

Trade-off:
- more ambitious;
- too expensive for the current phase and unnecessary for the immediate need.

**Recommendation:** Option B.

## Phase 1 Module Map

### 1. Public Pages

Purpose:
- edit institutional page copy without code changes;
- manage page sections as structured blocks;
- keep page content aligned with the public site structure.

Expected pages:
- home;
- institution;
- admissions;
- programs landing;
- blog landing;
- contact;
- any existing public page that already has a canonical route.

### 2. SEO

Purpose:
- edit title, description, canonical URL, social preview metadata, and indexed visibility by page.

Expected controls:
- title tag;
- meta description;
- Open Graph title and description;
- OG image;
- robots index/follow toggle where needed;
- canonical URL override when necessary.

### 3. Blog

Purpose:
- create, edit, publish, unpublish, and archive posts from the backoffice.

Expected controls:
- title;
- slug;
- excerpt;
- cover image;
- content body;
- category or tag;
- publish state;
- publish date;
- SEO metadata.

### 4. Media

Purpose:
- centralize reusable assets for the site.

Expected asset types:
- images;
- PDFs;
- institutional files;
- media URLs that can be reused in pages, programs, and blog entries.

### 5. Documents

Purpose:
- manage public institutional documents such as PDFs, notices, policies, resolutions, and downloads.

Expected controls:
- title;
- category;
- public visibility;
- file URL;
- display order;
- short description;
- linked page or section.

### 6. Banners, FAQs, Contact Config

Purpose:
- control the public landing experience and the basic support/inquiry surface.

Expected controls:
- homepage banners and CTAs;
- FAQ entries;
- contact information;
- WhatsApp or equivalent contact link;
- inquiry routing labels.

## Data Rules

- Public content remains structured in the database or content records already used by the app.
- Media files are not duplicated inside content records; content records store references to media URLs or asset identifiers.
- Blog posts must be listable from the public blog page and accessible individually by slug.
- SEO metadata is stored per page or per content item, not as hardcoded frontend constants.
- Document uploads remain trackable and reusable through a single media source of truth.

## Permissions

The current role model stays in place:
- `SUPER_ADMIN` can access all modules.
- `CONTENT_EDITOR` can manage public content, media, blog, documents, and SEO.
- `ADMISSIONS_MANAGER` remains focused on operational intake and future admissions modules.

If a module is not safe for editors, it stays `SUPER_ADMIN` only.

## UX Principles

The admin should feel like a normal professional dashboard, not a marketing site and not a developer tool.

Design rules:
- simple card-based forms;
- clear spacing and section labels;
- consistent save states;
- no cluttered editorial copy in the backoffice;
- enough hierarchy that non-technical staff can understand what to update.

## Operational Flow

1. The user opens the backoffice and enters the content center.
2. The user selects the module they need: pages, SEO, blog, media, documents, or public configuration.
3. They edit data in a structured form.
4. The system validates the data and persists it.
5. The public site reflects the change immediately or on the next render/cache update, depending on the route.
6. The user can verify the result from the public page without leaving the admin flow.

## Error Handling

- Invalid URLs, missing titles, and empty required fields should be blocked before save.
- Media references should fail with a clear message if the asset is missing or unsupported.
- SEO fields should fall back to sensible defaults if a page has no custom metadata.
- If a publish action fails, the item must remain in its previous state.

## QA Criteria

The phase is complete only if:
- the backoffice can update public pages without code changes;
- SEO fields can be edited per page;
- blog posts can be created and listed on the public site;
- media can be reused across pages and posts;
- documents can be managed and exposed publicly;
- the modules remain accessible by role and do not break the existing session flow;
- the public site reflects changes from the admin content records.

## Out of Scope

- admissions CRM workflows;
- lead scoring or pipeline automation;
- academic operations;
- user management expansion;
- audit trails beyond the current admin needs;
- redesigning the entire public site shell.

## Implementation Sequence

1. Stabilize the content module boundaries and shared admin patterns.
2. Add or extend page records for the public site.
3. Add per-page SEO editing.
4. Formalize blog CRUD.
5. Normalize media and documents around reusable assets.
6. Expose public configuration, banners, and FAQs in a clean admin surface.
7. Verify public rendering against the backoffice records.

## Success Definition

This phase is successful when a non-technical admin can keep the public site current from the backoffice alone, including content, images, documents, blog posts, and page metadata, without asking engineering for routine edits.
