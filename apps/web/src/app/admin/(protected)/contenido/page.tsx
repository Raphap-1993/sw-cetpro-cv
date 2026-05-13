import { listAdminContent, listAdminMedia } from "@/lib/admin/api";
import { requireAdminSection } from "@/lib/admin/session";
import type { ContentBlock, MediaAsset } from "@/lib/admin/types";
import { createContentAction, updateContentAction } from "../../actions";

export const dynamic = "force-dynamic";

const publishStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const blockTypes = ["HERO", "SECTION", "CTA", "TEXT", "IMAGE", "FAQ"] as const;
const programsEditorialGuide = [
  {
    page: "home",
    title: "Inicio /",
    keys: "hero-main, intro-main, programs-header, admission-main, cta-main"
  },
  {
    page: "institucion",
    title: "Institución /institucion",
    keys:
      "seo, hero-main, hero-body, section-main, section-secondary, cta-primary"
  },
  {
    page: "admision",
    title: "Admisión /admision",
    keys:
      "seo, hero-main, hero-body, section-main, section-secondary, cta-primary"
  },
  {
    page: "gestion-institucional",
    title: "Gestión /gestion-institucional",
    keys:
      "seo, hero-main, hero-body, section-main, section-secondary, cta-primary"
  },
  {
    page: "libro-de-reclamaciones",
    title: "Libro /libro-de-reclamaciones",
    keys:
      "seo, hero-main, hero-body, section-main, section-secondary, cta-primary"
  },
  {
    page: "programs",
    title: "Catálogo /programas",
    keys: "seo, hero-main, hero-summary, catalog-section, card-eyebrow, card-cta"
  },
  {
    page: "program-detail",
    title: "Detalle /programas/[slug]",
    keys:
      "seo, hero-caption, description-section, admission-section, contact-section, not-found"
  }
] as const;

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminContentPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSection("content");
  const [blocks, mediaAssets] = await Promise.all([
    listAdminContent(session.accessToken),
    listAdminMedia(session.accessToken)
  ]);
  const params = await searchParams;
  const error = getQueryValue(params.error);
  const success = getQueryValue(params.success);

  return (
    <section className="adminPanel">
      {error ? <p className="adminError">{error}</p> : null}
      {success ? <p className="adminMessage">{success}</p> : null}
      <div className="adminSectionHeading">
        <div>
          <p className="eyebrow">Contenido</p>
          <h2>Bloques CMS</h2>
        </div>
        <p>
          Este módulo inicial permite crear y corregir bloques por página para
          preparar el contenido real del portal.
        </p>
      </div>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Nuevo bloque</p>
            <h3>Crear contenido</h3>
          </div>
        </div>
        <ContentBlockForm />
      </section>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Guía rápida</p>
            <h3>Claves útiles para programas</h3>
          </div>
          <p>
            Estas combinaciones cubren el copy editorial y metadata pública que
            ahora se resuelve desde CMS.
          </p>
        </div>
        <div className="recentList">
          {programsEditorialGuide.map((guide) => (
            <article className="recentItem" key={guide.page}>
              <div>
                <strong>{guide.title}</strong>
                <span>{guide.keys}</span>
              </div>
              <span>{guide.page}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="adminGrid">
        {blocks.map((block) => (
          <article className="editorCard" key={block.id}>
            <details>
              <summary>
                <div>
                  <strong>
                    {block.page} / {block.key}
                  </strong>
                  <div className="editorMeta">
                    <span>{block.type}</span>
                    <span>Posicion {block.position}</span>
                    <span>{block.title ?? "Sin titulo"}</span>
                  </div>
                </div>
                <span className={`statusBadge ${block.status}`}>{block.status}</span>
              </summary>
              <ContentBlockForm block={block} />
            </details>
          </article>
        ))}
      </div>

      <MediaUrlDatalist mediaAssets={mediaAssets} />
    </section>
  );
}

function ContentBlockForm({ block }: { block?: ContentBlock }) {
  return (
    <form
      action={block ? updateContentAction : createContentAction}
      className="adminForm"
    >
      <input name="blockId" type="hidden" value={block?.id ?? ""} />
      <input name="previousPage" type="hidden" value={block?.page ?? ""} />
      <div className="adminFormGrid">
        <label className="adminField">
          Pagina
          <input
            defaultValue={block?.page ?? ""}
            name="page"
            placeholder="home"
            required
          />
        </label>
        <label className="adminField">
          Key
          <input
            defaultValue={block?.key ?? ""}
            name="key"
            placeholder="hero-principal"
            required
          />
        </label>
        <label className="adminField">
          Tipo
          <select defaultValue={block?.type ?? "SECTION"} name="type">
            {blockTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField">
          Estado
          <select defaultValue={block?.status ?? "DRAFT"} name="status">
            {publishStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField">
          Posicion
          <input
            defaultValue={String(block?.position ?? 0)}
            min={0}
            name="position"
            required
            type="number"
          />
        </label>
        <label className="adminField">
          Media URL
          <input
            defaultValue={block?.mediaUrl ?? ""}
            list="media-url-options"
            name="mediaUrl"
            placeholder="https://..."
          />
          <span className="adminHint">
            Usa una URL controlada desde Media para mantener consistencia editorial.
          </span>
        </label>
        <label className="adminField full">
          Titulo
          <input
            defaultValue={block?.title ?? ""}
            name="title"
            placeholder="Titulo del bloque"
          />
        </label>
        <label className="adminField full">
          Body
          <textarea
            defaultValue={block?.body ?? ""}
            name="body"
            placeholder="Contenido del bloque"
          />
        </label>
      </div>
      <button className="adminButton" type="submit">
        {block ? "Actualizar bloque" : "Crear bloque"}
      </button>
    </form>
  );
}

function MediaUrlDatalist({ mediaAssets }: { mediaAssets: MediaAsset[] }) {
  return (
    <datalist id="media-url-options">
      {mediaAssets.map((asset) => (
        <option key={asset.id} label={`${asset.title} · ${asset.type}`} value={asset.url} />
      ))}
    </datalist>
  );
}
