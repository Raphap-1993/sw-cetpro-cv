import Link from "next/link";
import { getRoleLabel, getSectionsForRole } from "@/lib/admin/permissions";
import { buildLogoutUrl, requireAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminSession();
  const sections = getSectionsForRole(session.user.role);

  return (
    <div className="adminRoot">
      <div className="adminShell">
        <header className="adminHeader">
          <div className="adminBrand">
            <p className="eyebrow">sw-cetpro-cv</p>
            <h1>Backoffice modular</h1>
            <p>
              Base administrativa inicial sobre Next.js y NestJS para contenido,
              programas y captacion.
            </p>
          </div>
          <aside className="adminUserCard">
            <strong>{session.user.name}</strong>
            <span>{session.user.email}</span>
            <span>Rol: {getRoleLabel(session.user.role)}</span>
          </aside>
        </header>

        <div className="adminLayout">
          <aside className="adminSidebar">
            <nav>
              {sections.map((section) => (
                <Link href={section.href} key={section.key}>
                  {section.label}
                </Link>
              ))}
            </nav>
            <p className="activeHint">
              La sesion queda firmada en cookie HTTP-only y el API mantiene la
              validacion real por JWT y rol.
            </p>
            <Link className="adminButtonGhost" href={buildLogoutUrl()}>
              Cerrar sesion
            </Link>
          </aside>
          <div className="adminMain">{children}</div>
        </div>
      </div>
    </div>
  );
}
