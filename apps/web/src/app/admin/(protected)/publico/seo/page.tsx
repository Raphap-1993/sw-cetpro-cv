import { listAdminMedia, listPageSeo } from "@/lib/admin/api";
import { requireAdminSection } from "@/lib/admin/session";
import type { MediaAsset, PageSeo } from "@/lib/admin/types";
import { upsertPageSeoAction } from "../../../actions";

export const dynamic = "force-dynamic";

const knownPages = [
  { key: "home", label: "Inicio" },
  { key: "institucion", label: "Institucion" },
  { key: "admision", label: "Admision" },
  { key: "programas", label: "Programas" },
  { key: "program-detail", label: "Detalle de programa" },
  { key: "gestion-institucional", label: "Gestion institucional" },
  { key: "libro-de-reclamaciones", label: "Libro de reclamaciones" },
  { key: "contacto", label: "Contacto" },
  { key: "blog", label: "Blog" }
] as const;

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getSeoByKey(records: PageSeo[]) {
  return new Map(records.map((record) => [record.pageKey, record] as const));
}

export default async function AdminPublicoSeoPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSection("publicContent");
  const [seoRecords, mediaAssets] = await Promise.all([
    listPageSeo(session.accessToken),
    listAdminMedia(session.accessToken)
  ]);
  const params = await searchParams;
  const error = getQueryValue(params.error);
  const success = getQueryValue(params.success);
  const seoByKey = getSeoByKey(seoRecords);

  return (
    <section className="adminPanel">
      {error ? <p className="adminError">{error}</p> : null}
      {success ? <p className="adminMessage">{success}</p> : null}
      <div className="adminSectionHeading">
        <div>
          <p className="eyebrow">SEO</p>
          <h2>Metadatos por pagina</h2>
        </div>
        <p>
          Ajusta titulo, descripcion, canonical y robots para cada pagina
          publica importante.
        </p>
      </div>

      <div className="adminGrid">
        {knownPages.map((page) => {
          const seo = seoByKey.get(page.key);

          return (
            <article className="editorCard" key={page.key}>
              <div className="adminSectionHeading">
                <div>
                  <p className="eyebrow">{page.label}</p>
                  <h3>{page.key}</h3>
                </div>
                <span className={`statusBadge ${seo ? "PUBLISHED" : "DRAFT"}`}>
                  {seo ? "Configurado" : "Pendiente"}
                </span>
              </div>
              <SeoForm mediaAssets={mediaAssets} pageKey={page.key} seo={seo} />
            </article>
          );
        })}
      </div>

      {seoRecords.length > knownPages.length ? (
        <section className="editorCard">
          <div className="adminSectionHeading">
            <div>
              <p className="eyebrow">Registros extra</p>
              <h3>SEO no mapeado</h3>
            </div>
          </div>
          <div className="recentList">
            {seoRecords
              .filter((record) => !knownPages.some((page) => page.key === record.pageKey))
              .map((record) => (
                <article className="recentItem" key={record.id}>
                  <div>
                    <strong>{record.pageKey}</strong>
                    <span>{record.title}</span>
                  </div>
                  <span>
                    {record.robotsIndex ? "Index" : "No index"} /{" "}
                    {record.robotsFollow ? "Follow" : "No follow"}
                  </span>
                </article>
              ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function SeoForm({
  pageKey,
  seo,
  mediaAssets
}: {
  pageKey: string;
  seo?: PageSeo;
  mediaAssets: MediaAsset[];
}) {
  return (
    <form action={upsertPageSeoAction} className="adminForm">
      <input name="pageKey" type="hidden" value={pageKey} />
      <div className="adminFormGrid">
        <label className="adminField full">
          Titulo
          <input
            defaultValue={seo?.title ?? ""}
            name="title"
            placeholder="Titulo SEO"
            required
          />
        </label>
        <label className="adminField full">
          Descripcion
          <textarea
            defaultValue={seo?.description ?? ""}
            name="description"
            placeholder="Descripcion SEO"
            required
          />
        </label>
        <label className="adminField">
          Canonical URL
          <input
            defaultValue={seo?.canonicalUrl ?? ""}
            name="canonicalUrl"
            placeholder="https://..."
          />
        </label>
        <label className="adminField">
          Imagen OG
          <input
            defaultValue={seo?.ogImageUrl ?? ""}
            list="media-url-options"
            name="ogImageUrl"
            placeholder="https://..."
          />
        </label>
        <label className="adminField">
          Titulo OG
          <input
            defaultValue={seo?.ogTitle ?? ""}
            name="ogTitle"
            placeholder="Titulo para redes"
          />
        </label>
        <label className="adminField">
          Descripcion OG
          <input
            defaultValue={seo?.ogDescription ?? ""}
            name="ogDescription"
            placeholder="Descripcion para redes"
          />
        </label>
        <label className="adminField">
          <span>Indexar pagina</span>
          <input
            defaultChecked={seo?.robotsIndex ?? true}
            name="robotsIndex"
            type="checkbox"
          />
        </label>
        <label className="adminField">
          <span>Seguir enlaces</span>
          <input
            defaultChecked={seo?.robotsFollow ?? true}
            name="robotsFollow"
            type="checkbox"
          />
        </label>
      </div>

      <div className="adminToolbar">
        <button className="adminButton" type="submit">
          Guardar SEO
        </button>
      </div>

      <MediaUrlDatalist mediaAssets={mediaAssets} />
    </form>
  );
}

function MediaUrlDatalist({ mediaAssets }: { mediaAssets: MediaAsset[] }) {
  return (
    <datalist id="media-url-options">
      {mediaAssets.map((asset) => (
        <option
          key={asset.id}
          label={`${asset.title} · ${asset.type}`}
          value={asset.url}
        />
      ))}
    </datalist>
  );
}
