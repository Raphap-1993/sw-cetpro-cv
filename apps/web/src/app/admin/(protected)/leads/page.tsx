import { listAdminLeads } from "@/lib/admin/api";
import { requireAdminSection } from "@/lib/admin/session";
import { updateLeadStatusAction } from "../../actions";

export const dynamic = "force-dynamic";

const formatter = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short"
});

const leadStatuses = ["NEW", "CONTACTED", "CLOSED", "DISCARDED"] as const;

function getQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLeadsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
}) {
  const session = await requireAdminSection("leads");
  const leads = await listAdminLeads(session.accessToken);
  const params = await searchParams;
  const error = getQueryValue(params.error);
  const success = getQueryValue(params.success);

  return (
    <section className="adminPanel">
      {error ? <p className="adminError">{error}</p> : null}
      {success ? <p className="adminMessage">{success}</p> : null}
      <div className="adminSectionHeading">
        <div>
          <p className="eyebrow">Captacion</p>
          <h2>Bandeja de leads</h2>
        </div>
        <p>
          Cambia el estado del seguimiento sin salir de la vista. El API sigue
          siendo la fuente de verdad.
        </p>
      </div>

      <div className="adminGrid">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <article className="leadCard" key={lead.id}>
              <div className="adminSectionHeading">
                <div>
                  <p className="eyebrow">Lead</p>
                  <h3>{lead.fullName}</h3>
                </div>
                <span className={`statusBadge ${lead.status}`}>{lead.status}</span>
              </div>

              <div className="leadMeta">
                <span>{lead.email}</span>
                <span>{lead.phone}</span>
                <span>{formatter.format(new Date(lead.createdAt))}</span>
                <span>{lead.program?.title ?? "Sin programa asociado"}</span>
              </div>

              <p className="adminMessage">
                {lead.message?.trim() || "Sin comentario adicional."}
              </p>

              <form action={updateLeadStatusAction} className="inlineForm">
                <input name="leadId" type="hidden" value={lead.id} />
                <label className="adminField">
                  Estado interno
                  <select defaultValue={lead.status} name="status">
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit">Guardar estado</button>
              </form>
            </article>
          ))
        ) : (
          <div className="adminEmpty">
            <p>No hay solicitudes registradas por ahora.</p>
          </div>
        )}
      </div>
    </section>
  );
}
