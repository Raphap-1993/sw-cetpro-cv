import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import pageStyles from "@/app/public-site.module.css";
import { getPublicVisual, publicContactHref } from "@/app/public-site";
import { ProgramCard, type ProgramCardCopy } from "./ProgramCard";
import { getProgramsCatalogContent } from "./content";
import styles from "./programs.module.css";
import { listPublishedPrograms } from "./programs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getProgramsCatalogContent();

  return {
    title: content.seo.title,
    description: content.seo.body,
    alternates: {
      canonical: "/programas"
    }
  };
}

export default async function ProgramsCatalogPage() {
  const [programs, content] = await Promise.all([
    listPublishedPrograms(),
    getProgramsCatalogContent()
  ]);
  const heroMediaUrl = getPublicVisual("programs");
  const heroMediaKind = "photo";
  const cardCopy: ProgramCardCopy = {
    eyebrow: content["card-eyebrow"].title,
    durationLabel: content["card-duration-label"].title,
    modalityLabel: content["card-modality-label"].title,
    ctaLabel: content["card-cta"].title
  };
  const durations = Array.from(
    new Set(
      programs
        .map((program) => program.duration)
        .filter((duration): duration is string => !!duration)
    )
  );
  const modalities = Array.from(
    new Set(
      programs
        .map((program) => program.modality)
        .filter((modality): modality is string => !!modality)
    )
  );

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Abrir admisión">
      <section className={pageStyles.pageHero} data-hero-section>
        <div className={`shell ${pageStyles.pageHeroGrid}`}>
          <div className={pageStyles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={pageStyles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Programas</span>
            </nav>
            <p className={pageStyles.eyebrow} data-hero-item>
              {content["hero-eyebrow"].title}
            </p>
            <h1 className={pageStyles.pageTitle} data-hero-item>
              {content["hero-main"].title}
            </h1>
            <p className={pageStyles.pageLead} data-hero-item>
              {content["hero-main"].body}
            </p>

            <div className={pageStyles.actionRow} data-hero-item>
              <a className={pageStyles.primaryAction} href="#catalogo">
                {content["hero-primary-cta"].title}
              </a>
              <Link className={pageStyles.secondaryAction} href={publicContactHref}>
                {content["hero-secondary-cta"].title}
              </Link>
              <Link className={pageStyles.secondaryAction} href="/admision">
                Ir a admisión
              </Link>
            </div>
          </div>

          <aside
            className={`${pageStyles.pagePanel} ${pageStyles.pagePanelDark} ${
              pageStyles.pagePanelMedia
            }`}
            data-hero-stage
          >
            <div className={pageStyles.pagePanelVisual} data-media-kind={heroMediaKind}>
              <img alt="" src={heroMediaUrl} />
            </div>
            <div className={pageStyles.pagePanelBody}>
              <div data-hero-stage-item>
                <p className={pageStyles.eyebrow}>{content["hero-summary-eyebrow"].title}</p>
                <h2>{content["hero-summary"].title}</h2>
                <p>{content["hero-summary"].body}</p>
              </div>
              <div className={pageStyles.summaryGrid} data-card-grid data-hero-stage-item>
                <article className={pageStyles.summaryCard}>
                  <span>{content["hero-metric-programs"].title}</span>
                  <strong>{String(programs.length).padStart(2, "0")}</strong>
                </article>
                <article className={pageStyles.summaryCard}>
                  <span>{content["hero-metric-modalities"].title}</span>
                  <strong>
                    {modalities.length <= 1
                      ? (modalities[0] ?? "Por confirmar")
                      : "Varias"}
                  </strong>
                </article>
                <article className={pageStyles.summaryCard}>
                  <span>{content["hero-metric-published"].title}</span>
                  <strong>
                    {durations.length <= 1
                      ? (durations[0] ?? "Por confirmar")
                      : "Según programa"}
                  </strong>
                </article>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.catalogSection} id="catalogo">
        <div className="shell">
          <div className={styles.sectionHeading} data-section-header>
            <p className={pageStyles.eyebrow}>{content["catalog-eyebrow"].title}</p>
            <h2>{content["catalog-section"].title}</h2>
            <p>{content["catalog-section"].body}</p>
          </div>

          {programs.length > 0 ? (
            <div className={styles.programGrid} data-card-grid>
              {programs.map((program) => (
                <ProgramCard key={program.id} copy={cardCopy} program={program} />
              ))}
            </div>
          ) : (
            <article className={styles.emptyState}>
              <h3>{content["empty-state"].title}</h3>
              <p>{content["empty-state"].body}</p>
            </article>
          )}
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className="shell">
          <article className={styles.catalogCallout} data-reveal>
            <div>
              <p className={pageStyles.eyebrow}>Admisión</p>
              <h2>Cuando identifiques un programa de interés, continúa con el proceso de admisión.</h2>
              <p>
                El equipo administrativo atiende consultas sobre vacantes, turnos
                y requisitos para cada especialidad presencial en Pucallpa, Ucayali.
              </p>
            </div>
            <div className={pageStyles.actionRow}>
              <Link className={pageStyles.primaryAction} href="/admision">
                Proceso de admisión
              </Link>
              <Link className={pageStyles.secondaryAction} href={publicContactHref}>
                Ir a contacto
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
