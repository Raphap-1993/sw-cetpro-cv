import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { buildAdmissionHref } from "@/app/public-site";
import { ProgramCard, type ProgramCardCopy } from "../ProgramCard";
import { getProgramDetailContent, getProgramsCatalogContent } from "../content";
import styles from "../programs.module.css";
import {
  getProgramCopy,
  getProgramParagraphs,
  getPublishedProgramBySlug,
  getStudyPlanItems,
  listPublishedPrograms
} from "../programs";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [program, content] = await Promise.all([
    getPublishedProgramBySlug(slug),
    getProgramDetailContent()
  ]);

  if (!program) {
    return {
      title: content["not-found"].title,
      description: content["not-found"].body
    };
  }

  const title = `${program.title} | ${content.seo.title}`;
  const description = getProgramCopy(program) || content.seo.body;

  return {
    title,
    description,
    alternates: {
      canonical: `/programas/${slug}`
    }
  };
}

export default async function ProgramDetailPage({
  params
}: ProgramDetailPageProps) {
  const { slug } = await params;
  const [program, programs, content, catalogContent] = await Promise.all([
    getPublishedProgramBySlug(slug),
    listPublishedPrograms(),
    getProgramDetailContent(),
    getProgramsCatalogContent()
  ]);

  if (!program) {
    notFound();
  }

  const descriptionParagraphs = getProgramParagraphs(
    program.description ?? program.summary
  );
  const studyPlanItems = getStudyPlanItems(program.studyPlan);
  const admissionItems = getProgramParagraphs(content["admission-section"].body);
  const relatedPrograms = programs
    .filter((candidate) => candidate.id !== program.id)
    .slice(0, 3);
  const cardCopy: ProgramCardCopy = {
    eyebrow: catalogContent["card-eyebrow"].title,
    durationLabel: catalogContent["card-duration-label"].title,
    modalityLabel: catalogContent["card-modality-label"].title,
    ctaLabel: catalogContent["card-cta"].title
  };
  const admissionHref = buildAdmissionHref(program.slug);

  return (
    <PublicSiteFrame ctaHref={admissionHref}>
      <section className={styles.detailHero}>
        <div className={`shell ${styles.detailHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/programas">Programas</Link>
              <span>/</span>
              <span>{program.title}</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1>{program.title}</h1>
            <p className={styles.heroLead}>{getProgramCopy(program)}</p>

            <div className={styles.actionRow}>
              <Link className={styles.primaryAction} href={admissionHref}>
                {content["hero-primary-cta"].title}
              </Link>
              <Link className={styles.secondaryAction} href="/programas">
                {content["hero-secondary-cta"].title}
              </Link>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <p className={styles.pageLabel}>{content["hero-caption-eyebrow"].title}</p>
            <h2>{content["hero-caption"].title}</h2>
            <p>{content["hero-caption"].body}</p>
            <div className={styles.metricGrid}>
              <article className={styles.metricCard}>
                <span>{content["metric-duration-label"].title}</span>
                <strong>{program.duration ?? "Por confirmar"}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{content["metric-modality-label"].title}</span>
                <strong>{program.modality ?? "Por confirmar"}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{content["metric-study-plan-label"].title}</span>
                <strong>
                  {studyPlanItems.length > 0
                    ? `${studyPlanItems.length} bloques`
                    : "Referencial"}
                </strong>
              </article>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard}>
            <p className={styles.pageLabel}>{content["description-eyebrow"].title}</p>
            <h2>{content["description-section"].title}</h2>
            <div className={styles.textStack}>
              {(descriptionParagraphs.length > 0
                ? descriptionParagraphs
                : [getProgramCopy(program)]
              ).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className={styles.detailCard}>
            <p className={styles.pageLabel}>{content["admission-eyebrow"].title}</p>
            <h2>{content["admission-section"].title}</h2>
            <ul className={styles.noteList}>
              {admissionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.actionRow}>
              <Link className={styles.primaryAction} href={admissionHref}>
                Continuar con admisión
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className="shell">
          <article className={styles.detailCard}>
            <p className={styles.pageLabel}>{content["study-plan-eyebrow"].title}</p>
            <h2>{content["study-plan-section"].title}</h2>

            {studyPlanItems.length > 0 ? (
              <ol className={styles.studyPlanList}>
                {studyPlanItems.map((item, index) => (
                  <li className={styles.studyPlanItem} key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.emptyCopy}>{content["study-plan-empty"].body}</p>
            )}
          </article>
        </div>
      </section>

      {relatedPrograms.length > 0 ? (
        <section className={styles.detailSection}>
          <div className="shell">
            <div className={styles.sectionHeading}>
              <p className={styles.pageLabel}>{content["related-eyebrow"].title}</p>
              <h2>{content["related-section"].title}</h2>
              <p>{content["related-section"].body}</p>
            </div>

            <div className={styles.programGrid}>
              {relatedPrograms.map((relatedProgram) => (
                <ProgramCard
                  key={relatedProgram.id}
                  copy={cardCopy}
                  program={relatedProgram}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PublicSiteFrame>
  );
}
