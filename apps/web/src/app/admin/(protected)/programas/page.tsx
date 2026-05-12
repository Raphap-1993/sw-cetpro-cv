import { listAdminMedia, listAdminPrograms } from "@/lib/admin/api";
import { requireAdminSection } from "@/lib/admin/session";
import type { MediaAsset, Program } from "@/lib/admin/types";
import {
  createProgramAction,
  reorderProgramAction,
  updateProgramAction
} from "../../actions";

export const dynamic = "force-dynamic";

const publishStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProgramsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSection("programs");
  const [programs, mediaAssets] = await Promise.all([
    listAdminPrograms(session.accessToken),
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
          <p className="eyebrow">Catalogo</p>
          <h2>Programas</h2>
        </div>
        <p>
          Crea o actualiza fichas base del catalogo público desde este primer
          módulo editorial.
        </p>
      </div>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Nuevo registro</p>
            <h3>Crear programa</h3>
          </div>
        </div>
        <ProgramForm />
      </section>

      <section className="editorCard">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Orden editorial</p>
            <h3>Reordenar catálogo</h3>
          </div>
          <p>
            Usa subir y bajar para ajustar el orden visible sin recalcular
            manualmente `position`.
          </p>
        </div>

        <div className="recentList">
          {programs.map((program, index) => (
            <article className="recentItem" key={program.id}>
              <div>
                <strong>{program.title}</strong>
                <span>
                  Posicion {program.position} · {program.slug}
                </span>
              </div>
              <div className="adminToolbar">
                <form action={reorderProgramAction}>
                  <input name="programId" type="hidden" value={program.id} />
                  <input name="slug" type="hidden" value={program.slug} />
                  <input name="direction" type="hidden" value="up" />
                  <button
                    className="adminButtonGhost"
                    disabled={index === 0}
                    type="submit"
                  >
                    Subir
                  </button>
                </form>
                <form action={reorderProgramAction}>
                  <input name="programId" type="hidden" value={program.id} />
                  <input name="slug" type="hidden" value={program.slug} />
                  <input name="direction" type="hidden" value="down" />
                  <button
                    className="adminButtonGhost"
                    disabled={index === programs.length - 1}
                    type="submit"
                  >
                    Bajar
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="adminGrid">
        {programs.map((program) => (
          <article className="editorCard" key={program.id}>
            <details>
              <summary>
                <div>
                  <strong>{program.title}</strong>
                  <div className="editorMeta">
                    <span>Orden {program.position}</span>
                    <span>{program.slug}</span>
                    <span>{program.duration ?? "Duracion por definir"}</span>
                    <span>{program.modality ?? "Modalidad por definir"}</span>
                  </div>
                </div>
                <span className={`statusBadge ${program.status}`}>
                  {program.status}
                </span>
              </summary>
              <ProgramForm program={program} />
            </details>
          </article>
        ))}
      </div>

      <MediaUrlDatalist mediaAssets={mediaAssets} />
    </section>
  );
}

function ProgramForm({ program }: { program?: Program }) {
  return (
    <form
      action={program ? updateProgramAction : createProgramAction}
      className="adminForm"
    >
      <input name="programId" type="hidden" value={program?.id ?? ""} />
      <input name="previousSlug" type="hidden" value={program?.slug ?? ""} />
      <div className="adminFormGrid">
        <label className="adminField">
          Titulo
          <input
            defaultValue={program?.title ?? ""}
            name="title"
            placeholder="Programacion de sistemas de informacion"
            required
          />
        </label>
        <label className="adminField">
          Slug
          <input
            defaultValue={program?.slug ?? ""}
            name="slug"
            placeholder="programacion-de-sistemas-de-informacion"
          />
        </label>
        <label className="adminField">
          Duracion
          <input
            defaultValue={program?.duration ?? ""}
            name="duration"
            placeholder="12 meses"
          />
        </label>
        <label className="adminField">
          Modalidad
          <input
            defaultValue={program?.modality ?? ""}
            name="modality"
            placeholder="Presencial"
          />
        </label>
        <label className="adminField">
          Posicion
          <input
            defaultValue={program?.position}
            min={0}
            name="position"
            placeholder="Se asigna al final si queda vacio"
            type="number"
          />
        </label>
        <label className="adminField">
          Estado
          <select defaultValue={program?.status ?? "DRAFT"} name="status">
            {publishStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="adminField">
          Imagen
          <input
            defaultValue={program?.imageUrl ?? ""}
            list="media-url-options"
            name="imageUrl"
            placeholder="https://..."
          />
          <span className="adminHint">
            Reutiliza una URL registrada en Media desde las sugerencias del campo.
          </span>
        </label>
        <label className="adminField full">
          Resumen
          <textarea
            defaultValue={program?.summary ?? ""}
            name="summary"
            placeholder="Resumen corto del programa"
          />
        </label>
        <label className="adminField full">
          Descripcion
          <textarea
            defaultValue={program?.description ?? ""}
            name="description"
            placeholder="Descripcion completa"
          />
        </label>
        <label className="adminField full">
          Plan de estudio
          <textarea
            defaultValue={program?.studyPlan ?? ""}
            name="studyPlan"
            placeholder="Modulos o estructura base"
          />
        </label>
      </div>
      <button className="adminButton" type="submit">
        {program ? "Actualizar programa" : "Crear programa"}
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
