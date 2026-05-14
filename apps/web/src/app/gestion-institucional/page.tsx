import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { managementDocuments } from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("gestion-institucional");

  return {
    title: content.seo.title,
    description: content.seo.body,
    alternates: {
      canonical: "/gestion-institucional"
    }
  };
}

export default async function ManagementPage() {
  const content = await getPageContent("gestion-institucional");
  const keyNotes = [
    "Documentos de consulta para estudiantes, familias y comunidad educativa.",
    "Información preparada para revisión y verificación institucional.",
    "La publicación resguarda datos personales y anexos no previstos para difusión."
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.pageHero}>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Gestión institucional</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1 className={styles.pageTitle}>{content["hero-main"].title}</h1>
            <p className={styles.pageLead}>{content["hero-body"].body}</p>
          </div>

          <aside className={styles.sideNote}>
            <p className={styles.pageLabel}>{content["hero-note"].title}</p>
            <h2>{content["section-secondary"].title}</h2>
            <p>{content["section-secondary"].body}</p>
            <ul className={styles.heroList}>
              {keyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <div className={styles.sectionHeading}>
            <p className={styles.pageLabel}>{content["section-main"].title}</p>
            <h2>Documentos institucionales e información de consulta pública.</h2>
            <p>{content["section-main"].body}</p>
          </div>

          <div className={styles.documentGrid}>
            {managementDocuments.map((document) => (
              <article className={styles.documentCard} key={document.slug}>
                <span className={styles.documentMeta}>Documento institucional</span>
                <h3 className={styles.documentCardTitle}>{document.title}</h3>
                <p>{document.summary}</p>
                <ul className={styles.documentHighlights}>
                  {document.highlights.slice(0, 2).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <Link
                  className={styles.documentCardLink}
                  href={`/gestion-institucional/${document.slug}`}
                >
                  Más información
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <article className={styles.calloutCard}>
            <p className={styles.pageLabel}>Publicación institucional</p>
            <div className={styles.spacedBlock}>
              <h2>La información pública se actualiza conforme a validación institucional.</h2>
              <p>
                Cada página resume el alcance del documento y, cuando corresponda,
                incorporará enlaces o medios de verificación autorizados para su
                consulta.
              </p>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
