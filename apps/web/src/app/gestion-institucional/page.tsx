import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { buildPageMetadata } from "@/lib/public-seo";
import { getPublicVisual, managementDocuments } from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("gestion-institucional");

  return buildPageMetadata({
    pageKey: "gestion-institucional",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: "/gestion-institucional",
    fallbackOgImageUrl: getPublicVisual("management")
  });
}

export default async function ManagementPage() {
  const content = await getPageContent("gestion-institucional");
  const heroMediaUrl = getPublicVisual("management");
  const heroMediaKind = "photo";
  const keyNotes = [
    "Documentos de consulta para estudiantes, familias y comunidad educativa.",
    "Información preparada para revisión y verificación institucional.",
    "La publicación resguarda datos personales y anexos no previstos para difusión."
  ];

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Solicitar orientación">
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Gestión institucional</span>
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
                <h2>{content["section-secondary"].title}</h2>
                <p>{content["section-secondary"].body}</p>
              </div>
              <ul className={styles.noteList} data-reveal>
                {keyNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <div className={styles.sectionHeader} data-section-header>
            <p className={styles.eyebrow}>{content["section-main"].title}</p>
            <h2>Documentos institucionales e información de consulta pública.</h2>
            <p>{content["section-main"].body}</p>
          </div>

          <div className={styles.documentGrid} data-document-grid>
            {managementDocuments.map((document) => (
              <article className={styles.documentCard} key={document.slug}>
                <span className={styles.documentMeta}>Documento institucional</span>
                <h3 className={styles.documentTitle}>{document.title}</h3>
                <p>{document.summary}</p>
                <ul className={styles.detailList}>
                  {document.highlights.slice(0, 2).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className={styles.actionRow}>
                  <Link
                    className={styles.inlineAction}
                    href={`/gestion-institucional/${document.slug}`}
                  >
                    Más información
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <article className={styles.calloutCard} data-reveal>
            <p className={styles.eyebrow}>Publicación institucional</p>
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
