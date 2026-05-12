import { listAdminMedia } from "@/lib/admin/api";
import { requireAdminSection } from "@/lib/admin/session";
import type { MediaAsset, MediaAssetStatus, MediaAssetType } from "@/lib/admin/types";
import {
  createMediaAction,
  deleteMediaAction,
  uploadMediaAction,
  updateMediaAction
} from "../../actions";

export const dynamic = "force-dynamic";

const mediaStatuses: MediaAssetStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const mediaTypes: MediaAssetType[] = ["IMAGE", "DOCUMENT", "VIDEO", "OTHER"];

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSection("media");
  const assets = await listAdminMedia(session.accessToken);
  const params = await searchParams;
  const error = getQueryValue(params.error);
  const success = getQueryValue(params.success);

  return (
    <section className="adminPanel">
      {error ? <p className="adminError">{error}</p> : null}
      {success ? <p className="adminMessage">{success}</p> : null}
      <div className="adminSectionHeading">
        <div>
          <p className="eyebrow">Media</p>
          <h2>Biblioteca de assets</h2>
        </div>
        <p>
          Decision operativa vigente: uploads locales en disco del servidor
          para produccion y URLs externas solo cuando haga falta reutilizar un
          recurso ya publicado fuera del stack.
        </p>
      </div>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Upload local</p>
            <h3>Subir archivo</h3>
          </div>
          <p>
            Los archivos subidos quedan gobernados por el API y apuntan a una
            ruta local controlada por `.env`.
          </p>
        </div>
        <MediaUploadForm />
      </section>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">URL externa</p>
            <h3>Registrar media por URL</h3>
          </div>
          <p>
            Usa esta opcion solo para recursos que deban mantenerse fuera del
            almacenamiento local del proyecto.
          </p>
        </div>
        <MediaAssetForm />
      </section>

      {assets.length > 0 ? (
        <div className="adminGrid">
          {assets.map((asset) => (
            <article className="editorCard" key={asset.id}>
              <details>
                <summary>
                  <div>
                    <strong>{asset.title}</strong>
                    <div className="editorMeta">
                      <span>{asset.type}</span>
                      <span>{asset.source === "LOCAL_UPLOAD" ? "Upload local" : "URL externa"}</span>
                      <span>{asset.url}</span>
                      <span>{asset.altText ?? "Sin alt text"}</span>
                    </div>
                  </div>
                  <span className={`statusBadge ${asset.status}`}>{asset.status}</span>
                </summary>
                <MediaAssetForm asset={asset} />
              </details>
            </article>
          ))}
        </div>
      ) : (
        <article className="adminEmpty">
          <h3>Biblioteca vacía</h3>
          <p>
            Registra assets con URL controlada para reutilizarlos desde
            Programas y Contenido.
          </p>
        </article>
      )}
    </section>
  );
}

function MediaAssetForm({ asset }: { asset?: MediaAsset }) {
  const previewable =
    (asset?.type ?? "IMAGE") === "IMAGE" && Boolean(asset?.url?.trim());
  const isLocalUpload = asset?.source === "LOCAL_UPLOAD";

  return (
    <form
      action={asset ? updateMediaAction : createMediaAction}
      className="adminForm"
    >
      <input name="assetId" type="hidden" value={asset?.id ?? ""} />
      <div className="adminFormGrid">
        <label className="adminField">
          Titulo
          <input
            defaultValue={asset?.title ?? ""}
            name="title"
            placeholder="Hero institucional CETPRO"
            required
          />
        </label>
        <label className="adminField">
          Tipo
          <select defaultValue={asset?.type ?? "IMAGE"} name="type">
            {mediaTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField">
          Estado
          <select defaultValue={asset?.status ?? "PUBLISHED"} name="status">
            {mediaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField full">
          URL
          <input
            defaultValue={asset?.url ?? ""}
            name="url"
            placeholder="https://..."
            readOnly={isLocalUpload}
            required
          />
          {isLocalUpload ? (
            <span className="adminHint">
              La URL del upload local se genera automaticamente desde el
              almacenamiento del servidor.
            </span>
          ) : null}
        </label>
        <label className="adminField full">
          Alt text
          <input
            defaultValue={asset?.altText ?? ""}
            name="altText"
            placeholder="Descripcion breve para uso editorial"
          />
        </label>
      </div>

      {previewable ? (
        <div className="mediaPreviewCard">
          <div
            aria-label={asset?.altText ?? asset?.title ?? "Preview"}
            className="mediaPreviewImage"
            role="img"
            style={{ backgroundImage: `url("${asset?.url}")` }}
          />
        </div>
      ) : null}

      <div className="adminToolbar">
        <button className="adminButton" type="submit">
          {asset ? "Actualizar asset" : "Crear asset"}
        </button>
        {asset ? (
          <button
            className="adminButtonDanger"
            formAction={deleteMediaAction}
            type="submit"
          >
            Eliminar asset
          </button>
        ) : null}
      </div>
    </form>
  );
}

function MediaUploadForm() {
  return (
    <form action={uploadMediaAction} className="adminForm">
      <div className="adminFormGrid">
        <label className="adminField full">
          Archivo
          <input
            accept="image/*,video/*,application/pdf"
            name="file"
            required
            type="file"
          />
        </label>
        <label className="adminField">
          Titulo
          <input
            name="title"
            placeholder="Se infiere desde el nombre del archivo si queda vacio"
          />
        </label>
        <label className="adminField">
          Tipo
          <select defaultValue="IMAGE" name="type">
            {mediaTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField">
          Estado
          <select defaultValue="PUBLISHED" name="status">
            {mediaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField full">
          Alt text
          <input
            name="altText"
            placeholder="Descripcion breve para accesibilidad y uso editorial"
          />
        </label>
      </div>

      <button className="adminButton" type="submit">
        Subir archivo
      </button>
    </form>
  );
}
