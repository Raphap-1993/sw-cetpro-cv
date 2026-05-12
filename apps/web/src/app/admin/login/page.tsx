import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { getAdminSession } from "@/lib/admin/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error = readParam(params.error);

  return (
    <main className="adminLoginPage">
      <section className="adminLoginHero">
        <div className="adminLoginCopy">
          <p className="eyebrow">Backoffice CETPRO</p>
          <h1>Operacion administrativa basica sobre Next.js.</h1>
          <p className="lead">
            Ingresa con un usuario autorizado para revisar leads, mantener
            programas y actualizar bloques de contenido institucional.
          </p>
          <div className="adminLoginHighlights">
            <p>Sesion http-only emitida por Next y respaldada por `auth/login`.</p>
            <p>Rutas protegidas en `/admin` con permisos por rol del backend.</p>
            <p>Vistas conectadas a `leads`, `programs/admin` y `content`.</p>
          </div>
        </div>

        <div className="adminLoginPanel">
          <div className="adminLoginHeader">
            <p className="eyebrow">Acceso interno</p>
            <h2>Iniciar sesion</h2>
          </div>

          {error ? <p className="adminNotice error">{error}</p> : null}

          <form action={loginAction} className="adminForm">
            <label className="adminField">
              Correo
              <input
                autoComplete="email"
                name="email"
                placeholder="admin@cetprocv.edu.pe"
                required
                type="email"
              />
            </label>

            <label className="adminField">
              Contrasena
              <input
                autoComplete="current-password"
                minLength={8}
                name="password"
                placeholder="********"
                required
                type="password"
              />
            </label>

            <button className="adminPrimaryButton" type="submit">
              Entrar al backoffice
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
