import Link from "next/link";
import {
  listAdminContent,
  listAdminLeads,
  listAdminMedia,
  listAdminPrograms
} from "@/lib/admin/api";
import {
  canAccessSection,
  getSectionsForRole
} from "@/lib/admin/permissions";
import { requireAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

const formatter = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short"
});

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSession();
  const role = session.user.role;
  const sections = getSectionsForRole(role);
  const params = await searchParams;
  const error = getQueryValue(params.error);
  const success = getQueryValue(params.success);

  const [leads, programs, content, media] = await Promise.all([
    canAccessSection(role, "leads")
      ? listAdminLeads(session.accessToken)
      : Promise.resolve([]),
    canAccessSection(role, "programs")
      ? listAdminPrograms(session.accessToken)
      : Promise.resolve([]),
    canAccessSection(role, "content")
      ? listAdminContent(session.accessToken)
      : Promise.resolve([]),
    canAccessSection(role, "media")
      ? listAdminMedia(session.accessToken)
      : Promise.resolve([])
  ]);

  return (
    <>
      {error ? <p className="adminError">{error}</p> : null}
      {success ? <p className="adminMessage">{success}</p> : null}
      <section className="adminHeroCard">
        <p className="eyebrow">Estado actual</p>
        <h2>El proyecto ya tiene base pública y ahora suma operación interna.</h2>
        <p>
          El formulario público está conectado, el API ya soporta programas,
          leads y bloques de contenido, y este panel cubre el primer slice
          administrativo sobre Next.js.
        </p>
      </section>

      <section className="adminStats">
        <article className="adminStatCard">
          <span>Leads visibles</span>
          <strong>{leads.length}</strong>
        </article>
        <article className="adminStatCard">
          <span>Programas</span>
          <strong>{programs.length}</strong>
        </article>
        <article className="adminStatCard">
          <span>Bloques de contenido</span>
          <strong>{content.length}</strong>
        </article>
        <article className="adminStatCard">
          <span>Assets de media</span>
          <strong>{media.length}</strong>
        </article>
      </section>

      <section className="adminPanel">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Bandeja reciente</p>
            <h2>Ultimos leads</h2>
          </div>
          {canAccessSection(role, "leads") ? (
            <Link className="adminButtonGhost" href="/admin/leads">
              Ver bandeja completa
            </Link>
          ) : null}
        </div>

        {leads.length > 0 ? (
          <div className="recentList">
            {leads.slice(0, 5).map((lead) => (
              <article className="recentItem" key={lead.id}>
                <div>
                  <strong>{lead.fullName}</strong>
                  <span>
                    {lead.email} · {lead.phone}
                  </span>
                </div>
                <div>
                  <strong>{lead.program?.title ?? "Sin programa asociado"}</strong>
                  <span>{formatter.format(new Date(lead.createdAt))}</span>
                </div>
                <span className={`statusBadge ${lead.status}`}>{lead.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="adminEmpty">
            <p>
              No hay leads visibles para tu rol o todavía no se registraron
              solicitudes.
            </p>
          </div>
        )}
      </section>

      <section className="adminPanel">
        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Operación</p>
            <h2>Modulos habilitados</h2>
          </div>
        </div>
        <div className="adminToolbar">
          {sections
            .filter((section) => section.key !== "dashboard")
            .map((section) => (
              <Link className="adminButtonGhost" href={section.href} key={section.key}>
                {section.label}
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
