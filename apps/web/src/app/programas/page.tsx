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
    },
    openGraph: {
      title: content.seo.title,
      description: content.seo.body,
      images: content.seo.mediaUrl ? [content.seo.mediaUrl] : undefined
    },
    twitter: {
      card: content.seo.mediaUrl ? "summary_large_image" : "summary",
      title: content.seo.title,
      description: content.seo.body,
      images: content.seo.mediaUrl ? [content.seo.mediaUrl] : undefined
    }
  };
}

export default async function ProgramsCatalogPage() {
  const [programs, content] = await Promise.all([
    listPublishedPrograms(),
    getProgramsCatalogContent()
  ]);
  const durations = Array.from(
    new Set(
      programs
        .map((program) => program.duration)
        .filter((duration): duration is string => !!duration)
    )
  );
  const modalities = new Set(
    programs
      .map((program) => program.modality)
      .filter((modality): modality is string => !!modality)
  );
  const cardCopy: ProgramCardCopy = {
    eyebrow: content["card-eyebrow"].title,
    durationLabel: content["card-duration-label"].title,
    modalityLabel: content["card-modality-label"].title,
    ctaLabel: content["card-cta"].title
  };
  const modalityLabel =
    modalities.size === 0
      ? "Presencial"
      : modalities.size === 1
        ? (Array.from(modalities)[0] ?? "Presencial")
        : `${modalities.size} modalidades`;
  const durationLabel =
    durations.length === 0
      ? "Por confirmar"
      : durations.length === 1
        ? durations[0]
        : durations.join(" / ");
  const selectionSignals = [
    {
      label: "Oferta visible",
      value: `${programs.length}`
    },
    {
      label: "Duración referencial",
      value: durationLabel
    },
    {
      label: "Modalidad vigente",
      value: modalityLabel
    }
  ];
  const catalogEvidence = [
    {
      label: "Lectura comparativa",
      value: "Primero catálogo",
      detail: "Explora enfoque, duración y modalidad antes de pasar a la ficha completa."
    },
    {
      label: "Decisión informada",
      value: "Luego detalle",
      detail: "Cada programa amplía perfil formativo, plan base y orientación de matrícula."
    },
    {
      label: "Ruta de contacto",
      value: "Después orientación",
      detail: "La consulta institucional te ayuda a aterrizar vacantes, turnos y siguiente paso."
    }
  ];
  const heroAsideStyle = content["hero-summary"].mediaUrl
    ? {
        backgroundImage: `linear-gradient(160deg, rgba(11, 99, 206, 0.94), rgba(16, 32, 51, 0.92)), url("${content["hero-summary"].mediaUrl}")`
      }
    : undefined;

  return (
    <PublicSiteFrame
      contactHref="/#contacto"
      ctaHref="/#contacto"
      navItems={[
        { href: "/", label: "Inicio" },
        { href: "#catalogo", label: "Catálogo" },
        { href: "/#admision", label: "Admisión" },
        { href: "/#contacto", label: "Contacto" }
      ]}
    >
      <section className={styles.catalogHero}>
        <div className={`shell ${styles.catalogHeroGrid}`}>
          <div className={styles.heroPanel}>
            <Link className={styles.pageBackLink} href="/">
              {content["hero-back-link"].title}
            </Link>
            <p className="eyebrow">{content["hero-eyebrow"].title}</p>
            <h1>{content["hero-main"].title}</h1>
            <p className={styles.heroLead}>{content["hero-main"].body}</p>
            <div className={styles.programActionRow}>
              <a className={styles.primaryAction} href="#catalogo">
                {content["hero-primary-cta"].title}
              </a>
              <Link className={styles.ghostAction} href="/#contacto">
                {content["hero-secondary-cta"].title}
              </Link>
            </div>

            <div className={styles.heroPillRow}>
              <span className={styles.heroPill}>Compara duración y modalidad</span>
              <span className={styles.heroPill}>Revisa fichas públicas</span>
              <span className={styles.heroPill}>Solicita orientación</span>
            </div>
          </div>

          <aside className={styles.heroAside} style={heroAsideStyle}>
            <p className="eyebrow">{content["hero-summary-eyebrow"].title}</p>
            <h2>{content["hero-summary"].title}</h2>
            <div className={styles.metricGrid}>
              {selectionSignals.map((signal) => (
                <article className={styles.metricCard} key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
            <p>{content["hero-summary"].body}</p>
            <ul className={styles.heroGuidanceList}>
              <li>Empieza por duración, modalidad y enfoque general.</li>
              <li>Abre la ficha completa para revisar descripción y plan base.</li>
              <li>Solicita orientación cuando ya tengas una preferencia inicial.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.catalogEvidenceSection}>
        <div className={`shell ${styles.catalogEvidenceGrid}`}>
          {catalogEvidence.map((item) => (
            <article className={styles.catalogEvidenceCard} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="catalogo">
        <div className="shell">
          <div className={styles.catalogIntroLayout}>
            <div className="sectionHeader">
              <p className="eyebrow">{content["catalog-eyebrow"].title}</p>
              <h2>{content["catalog-section"].title}</h2>
              <p className="sectionCopy">{content["catalog-section"].body}</p>
            </div>

            <aside className={styles.catalogNoteCard}>
              <p className="eyebrow">Lectura recomendada</p>
              <h3>Empieza por la comparación general y luego abre el detalle.</h3>
              <p>
                Cada tarjeta resume el enfoque de la especialidad y conecta con
                una página más completa para revisar plan base, orientación y
                continuidad del contacto.
              </p>
            </aside>
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

      <section className="section sectionMuted">
        <div className="shell">
          <article className={styles.catalogCtaPanel}>
            <div>
              <p className="eyebrow">Orientación académica</p>
              <h2>{content["hero-summary"].title}</h2>
              <p>{content["hero-summary"].body}</p>
            </div>
            <Link className={styles.primaryAction} href="/#contacto">
              {content["hero-secondary-cta"].title}
            </Link>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
