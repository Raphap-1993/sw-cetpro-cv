import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { getOfficialComplaintBookUrl } from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("libro-de-reclamaciones");

  return {
    title: content.seo.title,
    description: content.seo.body,
    alternates: {
      canonical: "/libro-de-reclamaciones"
    }
  };
}

export default async function ComplaintBookPage() {
  const content = await getPageContent("libro-de-reclamaciones");
  const officialComplaintBookUrl = getOfficialComplaintBookUrl();
  const requiredData = [
    "Nombre y documento de identidad del usuario.",
    "Descripción clara del hecho, canal o sede donde ocurrió.",
    "Fecha y hora aproximada del evento cuando aplique.",
    "Medio preferido para recibir respuesta y datos de contacto."
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.pageHero}>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Libro de reclamaciones</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1 className={styles.pageTitle}>{content["hero-main"].title}</h1>
            <p className={styles.pageLead}>{content["hero-body"].body}</p>

            <div className={styles.actionRow}>
              {officialComplaintBookUrl ? (
                <a
                  className={styles.primaryLink}
                  href={officialComplaintBookUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {content["cta-primary"].title}
                </a>
              ) : (
                <Link className={styles.primaryLink} href="/admision">
                  {content["cta-secondary"].title}
                </Link>
              )}
            </div>
          </div>

          <aside className={styles.sideNote}>
            <p className={styles.pageLabel}>{content["hero-note"].title}</p>
            <h2>{officialComplaintBookUrl ? "Canal de atención disponible" : "Canal digital en validación"}</h2>
            <p>
              {officialComplaintBookUrl
                ? "El acceso oficial se encuentra disponible para el registro y seguimiento de reclamos."
                : "Si el acceso digital aún no se encuentra disponible, solicita orientación administrativa para registrar tu atención."}
            </p>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <div className={styles.warningNote}>
            Antes de registrar un reclamo, verifica el canal aplicable según la
            naturaleza institucional del servicio y el tipo de atención requerida.
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.regimeGrid}`}>
          <article className={styles.regimeCard}>
            <span className={styles.documentMeta}>Entidad pública</span>
            <strong>Libro de reclamaciones de la administración pública</strong>
            <p>
              Debe contar con un acceso visible y puede operar en formato físico
              o virtual, según la regulación aplicable a la entidad.
            </p>
            <ul className={styles.documentHighlights}>
              <li>Plazo de atención: hasta 30 días hábiles.</li>
              <li>Debe existir responsable designado y seguimiento del reclamo.</li>
              <li>El acceso digital debe estar claramente identificado para la atención al usuario.</li>
            </ul>
          </article>

          <article className={styles.regimeCard}>
            <span className={styles.documentMeta}>Proveedor / privado</span>
            <strong>Libro de reclamaciones del consumidor</strong>
            <p>
              Si la institución opera bajo régimen privado como proveedor, el
              libro virtual debe estar activo y visible, con un aviso fácilmente
              identificable para el usuario.
            </p>
            <ul className={styles.documentHighlights}>
              <li>Plazo de atención: 15 días hábiles improrrogables.</li>
              <li>La hoja de reclamación debe poder registrarse con datos básicos del usuario.</li>
              <li>La visibilidad del aviso y del acceso virtual es parte crítica del cumplimiento.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.mainCard}>
            <p className={styles.pageLabel}>{content["section-main"].title}</p>
            <h2>Datos que conviene preparar antes del registro.</h2>
            <ul className={styles.detailList}>
              {requiredData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard}>
            <p className={styles.pageLabel}>{content["section-secondary"].title}</p>
            <h2>Canal de atención</h2>
            <p>{content["section-secondary"].body}</p>
            {officialComplaintBookUrl ? (
              <p className={styles.warningNote}>
                Canal oficial disponible para registro digital.
              </p>
            ) : (
              <p className={styles.warningNote}>
                Canal digital en validación institucional. Solicita orientación
                administrativa si necesitas registrar tu atención.
              </p>
            )}
          </aside>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
