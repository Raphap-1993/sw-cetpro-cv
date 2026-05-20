import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import styles from "@/app/public-site.module.css";
import {
  getPublicVisual,
  getManagementDocument,
  managementDocuments
} from "@/app/public-site";

type ManagementDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return managementDocuments.map((document) => ({
    slug: document.slug
  }));
}

export async function generateMetadata({
  params
}: ManagementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getManagementDocument(slug);

  if (!document) {
    return {
      title: "Documento institucional no encontrado",
      description:
        "La página solicitada no se encuentra disponible en la gestión institucional."
    };
  }

  return {
    title: `${document.title} | CETPRO Cesar Vallejo`,
    description: document.summary,
    alternates: {
      canonical: `/gestion-institucional/${slug}`
    }
  };
}

export default async function ManagementDetailPage({
  params
}: ManagementDetailPageProps) {
  const { slug } = await params;
  const document = getManagementDocument(slug);
  const heroMediaUrl = getPublicVisual("management");

  if (!document) {
    notFound();
  }

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Solicitar orientación">
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/gestion-institucional">Gestión institucional</Link>
              <span>/</span>
              <span>{document.title}</span>
            </nav>
            <p className={styles.eyebrow} data-hero-item>
              Gestión institucional
            </p>
            <h1 className={styles.pageTitle} data-hero-item>
              {document.title}
            </h1>
            <p className={styles.pageLead} data-hero-item>
              {document.summary}
            </p>
          </div>

          <aside
            className={`${styles.pagePanel} ${styles.pagePanelDark} ${styles.pagePanelMedia}`}
            data-hero-stage
          >
            <div className={styles.pagePanelVisual} data-media-kind="illustration">
              <img alt="" src={heroMediaUrl} />
            </div>
            <div className={styles.pagePanelBody}>
              <div data-hero-stage-item>
                <p className={styles.eyebrow}>Resumen público</p>
                <h2>Información institucional disponible.</h2>
                <p>{document.useCase}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard} data-reveal>
            <p className={styles.eyebrow}>Contenido de consulta</p>
            <ul className={styles.detailList}>
              {document.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard} data-reveal>
            <p className={styles.eyebrow}>Referencias institucionales</p>
            <ul className={styles.legalSignalList}>
              {document.legalSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <article className={styles.calloutCard} data-reveal>
            <p className={styles.eyebrow}>Publicación institucional</p>
            <div className={styles.spacedBlock}>
              <h2>Los documentos se difunden conforme a validación institucional.</h2>
              <p>
                Cuando corresponda, esta página incorporará el PDF, la resolución
                o el medio de verificación autorizado por la institución para su
                consulta pública.
              </p>
              <div className={styles.actionRow}>
                <Link className={styles.secondaryAction} href="/gestion-institucional">
                  Volver a documentos institucionales
                </Link>
                <Link className={styles.primaryAction} href="/admision">
                  Proceso de admisión
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
