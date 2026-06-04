import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { buildPageMetadata } from "@/lib/public-seo";
import {
  getOfficialComplaintBookUrl,
  getPublicVisual
} from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("libro-de-reclamaciones");

  return buildPageMetadata({
    pageKey: "libro-de-reclamaciones",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: "/libro-de-reclamaciones",
    fallbackOgImageUrl: getPublicVisual("complaints")
  });
}

export default async function ComplaintBookPage() {
  const content = await getPageContent("libro-de-reclamaciones");
  const officialComplaintBookUrl = getOfficialComplaintBookUrl();
  const heroMediaUrl = getPublicVisual("complaints");
  const heroMediaKind = "photo";
  const requiredData = [
    "Nombre y documento de identidad del usuario.",
    "Descripción clara del hecho, canal o sede donde ocurrió.",
    "Fecha y hora aproximada del evento cuando aplique.",
    "Medio preferido para recibir respuesta y datos de contacto."
  ];

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Solicitar orientación">
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Libro de reclamaciones</span>
            </nav>
            <p className={styles.eyebrow} data-hero-item>
              {content["hero-eyebrow"].title}
            </p>
            <h1 className={styles.pageTitle} data-hero-item>
              {content["hero-main"].title}
            </h1>
            <p className={styles.pageLead} data-hero-item>
              {content["hero-body"].body}
            </p>

            <div className={styles.actionRow} data-hero-item>
              {officialComplaintBookUrl ? (
                <a
                  className={styles.primaryAction}
                  href={officialComplaintBookUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {content["cta-primary"].title}
                </a>
              ) : (
                <Link className={styles.primaryAction} href="/admision">
                  {content["cta-secondary"].title}
                </Link>
              )}
            </div>
          </div>

          <aside
            className={`${styles.pagePanel} ${styles.pagePanelDark} ${
              styles.pagePanelMedia
            }`}
            data-hero-stage
          >
            <div className={styles.pagePanelVisual} data-media-kind={heroMediaKind}>
              <img alt="" src={heroMediaUrl} />
            </div>
            <div className={styles.pagePanelBody}>
              <div data-hero-stage-item>
                <p className={styles.eyebrow}>{content["hero-note"].title}</p>
                <h2>
                  {officialComplaintBookUrl
                    ? "Canal de atención disponible"
                    : "Canal digital en validación"}
                </h2>
                <p>
                  {officialComplaintBookUrl
                    ? "El acceso oficial se encuentra disponible para el registro y seguimiento de reclamos."
                    : "Si el acceso digital aún no se encuentra disponible, solicita orientación administrativa para registrar tu atención."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <div className={styles.warningNote} data-reveal>
            Antes de registrar un reclamo, verifica el canal aplicable según la
            naturaleza institucional del servicio y el tipo de atención requerida.
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.regimeGrid}`} data-feature-grid>
          <article className={styles.regimeCard}>
            <span className={styles.documentMeta}>Entidad pública</span>
            <strong>Libro de reclamaciones de la administración pública</strong>
            <p>
              Debe contar con un acceso visible y puede operar en formato físico
              o virtual, según la regulación aplicable a la entidad.
            </p>
            <ul className={styles.detailList}>
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
            <ul className={styles.detailList}>
              <li>Plazo de atención: 15 días hábiles improrrogables.</li>
              <li>La hoja de reclamación debe poder registrarse con datos básicos del usuario.</li>
              <li>La visibilidad del aviso y del acceso virtual es parte crítica del cumplimiento.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-main"].title}</p>
            <h2>Datos que conviene preparar antes del registro.</h2>
            <ul className={styles.detailList}>
              {requiredData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-secondary"].title}</p>
            <h2>Canal de atención</h2>
            <p>{content["section-secondary"].body}</p>
            {officialComplaintBookUrl ? (
              <div className={styles.warningNote}>
                <strong>Canal oficial disponible</strong>
                Acceso habilitado para registro digital.
              </div>
            ) : (
              <div className={styles.warningNote}>
                <strong>Canal digital en validación</strong>
                Solicita orientación administrativa si necesitas registrar tu atención.
              </div>
            )}
          </aside>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
