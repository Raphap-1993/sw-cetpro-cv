# CETPRO Public SEO + Contact CTA

**Status:** Draft pending user review  
**Scope:** Public-site SEO and global contact CTA  
**Owners by roster:** `Aether` for SEO/UX criteria, `Neon` for Next.js implementation, `Jarvis` for architecture fit, `Echo` for QA

## Goal

Improve the public site's positioning for local searches in Pucallpa and Ucayali, strengthen the four priority program pages, and add a friendly global contact CTA that helps students, parents, and the general public choose between WhatsApp and the existing contact form.

This slice is intentionally public-facing only. It does not redesign the backoffice and does not introduce a new admissions workflow.

## Business Target

Primary ranking target:
- CETPRO-related searches in `Pucallpa` and `Ucayali`.

Secondary ranking target:
- Peru-wide discovery of the institution, its programs, and its public activity.

Primary conversion target:
- dual contact path from the public site:
  - WhatsApp for quick questions;
  - existing form for guided follow-up.

## Current Reality

- The public site already runs on Next.js App Router.
- The site already has route-level metadata and canonical handling in some public pages.
- The backoffice already manages programs, so this slice should reuse existing public content rather than invent a new admin model for careers.
- The repo already contains recent content/SEO work; this change must fit the existing public structure instead of replacing it.

## Recommended Approach

### Option A: Add only the floating button
Improve contact without touching metadata, headings, or search signals.

Trade-off:
- fastest path;
- too weak for the ranking goal.

### Option B: Strengthen public SEO and add the floating button
Improve metadata, local signals, internal linking, page copy, and public contact behavior while reusing the existing content model.

Trade-off:
- focused scope with meaningful SEO value;
- requires touching several public pages, not just one component.

### Option C: Full public-site rewrite plus events launch
Use the SEO request as the start of a larger redesign and new editorial system.

Trade-off:
- more ambitious;
- too broad for the current improvement slice.

**Recommendation:** Option B.

## Scope

### In Scope

- strengthen technical SEO on the public site;
- improve on-page SEO and copy hierarchy on the home page and priority program pages;
- reinforce internal linking toward admissions and contact;
- add a global floating contact CTA with WhatsApp and the existing form;
- prepare the public architecture so a future events section fits naturally.

### Out of Scope

- redesigning the backoffice;
- creating a new admissions CRM flow;
- launching a full blog strategy;
- implementing a complete events module in this slice;
- changing the overall product architecture beyond what the public layer needs.

## SEO Strategy

The site should work on three connected layers:

### 1. Local brand authority

The home page and institutional pages must consistently signal:
- `CETPRO Cesar Vallejo`;
- `Pucallpa`;
- `Ucayali`;
- technical training and study programs;
- admissions and contact paths;
- visible institutional trust signals.

This layer supports searches such as:
- `cetpro en pucallpa`;
- `cetpro cesar vallejo pucallpa`;
- `carreras tecnicas en pucallpa`.

### 2. Program-level search intent

The four priority program pages should be treated as the strongest organic acquisition pages:
- `Estilismo`;
- `Apoyo administrativo`;
- `Panificacion`;
- `Programacion de sistemas de informacion`.

Each page should answer real public questions, not internal curriculum language:
- what the program is about;
- what the student will learn;
- who it is for;
- whether it is in-person;
- what opportunities it may open;
- how to ask for guidance.

### 3. Institutional activity authority

The site should be ready to present CETPRO activity through future event pages or listings:
- upcoming events;
- past events;
- photos, results, and community activity.

This is not the implementation focus of the slice, but the public SEO and internal linking should leave a clean place for it.

## Public Information Architecture

### Priority pages to strengthen now

- `/`
- `/programas`
- the four priority `/programas/[slug]` routes
- `/admision`
- `/institucion`
- `/contacto`

### Internal-linking rules

- home should link clearly to priority programs, admissions, and institutional trust pages;
- each priority program page should link to admissions and contact;
- admissions should link back to programs and public contact;
- institutional pages should reinforce brand trust and local identity, not exist as isolated compliance pages.

## Technical SEO Design

### Metadata

Every important public route should have:
- unique title;
- unique meta description;
- correct canonical;
- Open Graph title and description;
- consistent site-brand naming.

Special attention:
- home page title and description should target CETPRO + Pucallpa + Ucayali;
- priority program pages should include the program name and local context where it reads naturally;
- admissions and institutional pages should support trust and decision-making rather than generic brochure text.

### Structured data

The public site should include base institution/local structured data using `EducationalOrganization` as the primary schema for the CETPRO's public identity.

Minimum intent:
- institution name;
- public URL;
- location context;
- physical address when the public site already exposes it as official information;
- contact details if available and trustworthy;
- organizational identity.

If the public events section is implemented later, future event detail pages should be eligible for `Event` structured data only when the public page truly represents a real event with clear date and place information.

### Crawl and indexation

- keep `robots` clean and explicit;
- provide a real sitemap for public indexable routes;
- avoid duplicate canonicals or accidental canonical inheritance;
- do not create thin public pages only for ranking.

### Performance and rendering

The public SEO work must preserve:
- acceptable mobile rendering;
- clean heading hierarchy;
- image optimization discipline;
- stable SSR behavior and no route breakage when content is missing or partially edited.

## On-Page Content Direction

### Home page

The home page should speak more clearly about:
- what CETPRO Cesar Vallejo is;
- where it serves people;
- what programs it offers;
- how people can get guidance;
- why families and students can trust it.

The home page should not read like internal product copy or abstract marketing language.

### Priority program pages

The four priority pages should be tightened around readable public language.

Minimum content goals per page:
- clear H1;
- short and useful introduction;
- visible in-person study context where true;
- benefits or learning outcomes in simple language;
- guidance path to admissions/contact;
- helpful supporting headings rather than long undifferentiated text blocks.

### Admissions and trust pages

Admissions should reduce hesitation and answer basic decision questions.

Institutional pages should strengthen legitimacy for:
- parents;
- students;
- general public;
- search engines trying to assess trust and local relevance.

## Global Contact CTA Design

### Interaction model

Add a floating CTA anchored across the public site.

Recommended behavior:
- a visible floating trigger in the lower-right area;
- on click or tap, open a small panel with two actions;
- keep the panel short, readable, and mobile-friendly.

### CTA options

- `Escribenos por WhatsApp`
- `Dejanos tus datos y te orientamos`

### Friendly helper copy

Public-facing helper text should stay simple. Example tone:
- `Si tienes dudas sobre una carrera, podemos orientarte.`
- `Puedes escribirnos por WhatsApp o dejarnos tus datos.`

The language must avoid internal or technical terms such as:
- lead;
- conversion;
- funnel;
- channel;
- admissions pipeline.

### Routing behavior

- WhatsApp should go directly to the official public contact destination;
- the second action should take the user to the existing public form flow on `/admision`;
- if one route is temporarily unavailable, the component should degrade gracefully rather than rendering a broken action.

### Placement rules

The CTA should appear across the public site, especially where intent is strongest:
- home;
- program pages;
- admissions;
- institutional routes with inquiry potential.

It should not interfere with reading, mobile navigation, or existing fixed UI.

## Events Readiness

This slice should not fabricate an events section without real public content, but it should leave the public SEO structure ready for it.

Readiness means:
- the navigation and linking model can accommodate `Eventos`;
- the site can later expose both `proximos eventos` and `eventos realizados`;
- future event pages can link back to related programs and public contact;
- future structured data can be added without reworking the whole public SEO layer.

## Implementation Constraints

- reuse the current public routes and content model where possible;
- do not require a backoffice redesign to complete this slice;
- avoid large UI rewrites not directly tied to SEO or contact clarity;
- preserve the existing public design language unless a small UX adjustment is required for clarity.

## QA Criteria

This slice is complete only if:
- the public site builds, lints, and type-checks cleanly;
- the floating CTA appears and behaves correctly on desktop and mobile;
- the CTA copy feels understandable to students, parents, and the general public;
- metadata is coherent across key public routes;
- canonical and robots behavior remain sane;
- the home page and priority program pages read more clearly for local search intent;
- no broken public path is introduced for the form or WhatsApp contact.

## Success Definition

This slice is successful when the CETPRO public site becomes easier for Google to understand locally and easier for visitors to contact immediately, without requiring a new backoffice model or a full public-site rebuild.
