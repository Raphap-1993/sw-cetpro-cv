import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
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
  const metrics = [
    {
      label: "Oferta visible",
      value: String(programs.length)
    },
    {
      label: "Duración",
      value:
        durations.length <= 1 ? (durations[0] ?? "Por confirmar") : "Según programa"
    },
    {
      label: "Modalidad",
      value: modalities.length <= 1 ? (modalities[0] ?? "Por confirmar") : "Varias"
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.catalogHero}>
        <div className={`shell ${styles.catalogHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Programas</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1>{content["hero-main"].title}</h1>
            <p className={styles.heroLead}>{content["hero-main"].body}</p>

            <div className={styles.actionRow}>
              <a className={styles.primaryAction} href="#catalogo">
                {content["hero-primary-cta"].title}
              </a>
              <Link className={styles.secondaryAction} href="/admision">
                {content["hero-secondary-cta"].title}
              </Link>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <p className={styles.pageLabel}>{content["hero-summary-eyebrow"].title}</p>
            <h2>{content["hero-summary"].title}</h2>
            <p>{content["hero-summary"].body}</p>
            <div className={styles.metricGrid}>
              {metrics.map((metric) => (
                <article className={styles.metricCard} key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.catalogSection} id="catalogo">
        <div className="shell">
          <div className={styles.sectionHeading}>
            <p className={styles.pageLabel}>{content["catalog-eyebrow"].title}</p>
            <h2>{content["catalog-section"].title}</h2>
            <p>{content["catalog-section"].body}</p>
          </div>

          {programs.length > 0 ? (
            <div className={styles.programGrid}>
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
          <article className={styles.catalogCallout}>
            <div>
              <p className={styles.pageLabel}>Admisión</p>
              <h2>Cuando identifiques un programa de interés, continúa con el proceso de admisión.</h2>
              <p>
                El equipo administrativo atiende consultas sobre vacantes, turnos
                y requisitos para cada especialidad.
              </p>
            </div>
            <Link className={styles.primaryAction} href="/admision">
              Proceso de admisión
            </Link>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
