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
        { href: "#catalogo", label: "Catalogo" },
        { href: "/#admision", label: "Admision" },
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
          </div>

          <aside className={styles.heroAside} style={heroAsideStyle}>
            <p className="eyebrow">{content["hero-summary-eyebrow"].title}</p>
            <h2>{content["hero-summary"].title}</h2>
            <div className={styles.metricGrid}>
              <article className={styles.metricCard}>
                <span>{content["hero-metric-programs"].title}</span>
                <strong>{programs.length}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{content["hero-metric-modalities"].title}</span>
                <strong>
                  {modalities.size === 1
                    ? (Array.from(modalities)[0] ?? "Por confirmar")
                    : `${modalities.size || 0} modalidades`}
                </strong>
              </article>
              <article className={styles.metricCard}>
                <span>{content["hero-metric-published"].title}</span>
                <strong>{programs.length}</strong>
              </article>
            </div>
            <p>{content["hero-summary"].body}</p>
          </aside>
        </div>
      </section>

      <section className="section" id="catalogo">
        <div className="shell">
          <div className="sectionHeader">
            <p className="eyebrow">{content["catalog-eyebrow"].title}</p>
            <h2>{content["catalog-section"].title}</h2>
            <p className="sectionCopy">{content["catalog-section"].body}</p>
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
    </PublicSiteFrame>
  );
}
