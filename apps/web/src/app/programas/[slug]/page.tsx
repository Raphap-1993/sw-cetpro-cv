import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/app/components/LeadForm";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
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
      description: content["not-found"].body,
      openGraph: {
        title: content["not-found"].title,
        description: content["not-found"].body,
        images: content["not-found"].mediaUrl
          ? [content["not-found"].mediaUrl]
          : undefined
      },
      twitter: {
        card: content["not-found"].mediaUrl ? "summary_large_image" : "summary",
        title: content["not-found"].title,
        description: content["not-found"].body,
        images: content["not-found"].mediaUrl
          ? [content["not-found"].mediaUrl]
          : undefined
      }
    };
  }

  const title = `${program.title} | ${content.seo.title}`;
  const description = getProgramCopy(program) || content.seo.body;
  const image = program.imageUrl ?? content.seo.mediaUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/programas/${slug}`
    },
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined
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
  const descriptionIntro = getProgramParagraphs(
    content["description-section"].body
  );
  const admissionItems = getProgramParagraphs(content["admission-section"].body);
  const studyPlanIntro = getProgramParagraphs(content["study-plan-section"].body);
  const relatedPrograms = programs
    .filter((candidate) => candidate.id !== program.id)
    .slice(0, 3);
  const cardCopy: ProgramCardCopy = {
    eyebrow: catalogContent["card-eyebrow"].title,
    durationLabel: catalogContent["card-duration-label"].title,
    modalityLabel: catalogContent["card-modality-label"].title,
    ctaLabel: catalogContent["card-cta"].title
  };
  const heroImage = program.imageUrl ?? content["hero-caption"].mediaUrl;
  const studyPlanLabel =
    studyPlanItems.length > 1
      ? `${studyPlanItems.length} bloques base`
      : studyPlanItems.length === 1
        ? "Ruta referencial"
        : "En actualización";
  const heroSignals = [
    {
      label: "Duración",
      value: program.duration ?? "Por confirmar"
    },
    {
      label: "Modalidad",
      value: program.modality ?? "Por confirmar"
    },
    {
      label: "Plan de estudio",
      value: studyPlanLabel
    }
  ];
  const focusPreview =
    studyPlanItems.length > 0
      ? studyPlanItems.slice(0, 3)
      : [
          "Ruta formativa orientada a desempeño técnico real.",
          "Aprendizaje aplicado con acompañamiento institucional.",
          "Continuidad hacia consulta y proceso de matrícula."
        ];
  const detailHighlights = [
    {
      title: "Qué desarrollarás",
      body: focusPreview[0] ?? getProgramCopy(program)
    },
    {
      title: "Cómo se organiza",
      body:
        studyPlanItems.length > 1
          ? `La ficha presenta ${studyPlanItems.length} bloques base para entender la progresión inicial del aprendizaje.`
          : (focusPreview[1] ??
              "La ficha presenta una ruta referencial para ubicar el enfoque del programa.")
    },
    {
      title: "Siguiente paso",
      body:
        "Solicita orientación para revisar vacantes, turnos, documentos y continuidad del proceso con el programa ya seleccionado."
    }
  ];
  const heroMediaStyle = heroImage
    ? {
        backgroundImage: `linear-gradient(160deg, rgba(11, 99, 206, 0.52), rgba(16, 32, 51, 0.72)), url("${heroImage}")`
      }
    : undefined;

  return (
    <PublicSiteFrame
      contactHref="#contacto"
      ctaHref="#contacto"
      navItems={[
        { href: "/", label: "Inicio" },
        { href: "/programas", label: "Catálogo" },
        { href: "#contacto", label: "Admisión" },
        { href: "#contacto", label: "Contacto" }
      ]}
    >
      <section className={styles.programDetailHero}>
        <div className={`shell ${styles.programDetailLayout}`}>
          <div className={styles.detailPanel}>
            <nav
              aria-label="Ruta de navegación"
              className={styles.programBreadcrumbs}
            >
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/programas">Programas</Link>
              <span>/</span>
              <span>{program.title}</span>
            </nav>

            <p className="eyebrow">{content["hero-eyebrow"].title}</p>
            <h1>{program.title}</h1>
            <p className={styles.programSummary}>{getProgramCopy(program)}</p>

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
                  {studyPlanItems.length > 1
                    ? `${studyPlanItems.length} bloques`
                    : "Referencial"}
                </strong>
              </article>
            </div>

            <div className={styles.programActionRow}>
              <a className={styles.primaryAction} href="#contacto">
                {content["hero-primary-cta"].title}
              </a>
              <Link className={styles.ghostAction} href="/programas">
                {content["hero-secondary-cta"].title}
              </Link>
            </div>
          </div>

          <div className={styles.programHeroMedia} style={heroMediaStyle}>
            <div className={styles.programHeroCaption}>
              <div>
                <p className="eyebrow">{content["hero-caption-eyebrow"].title}</p>
                <strong>{content["hero-caption"].title}</strong>
                <p>{content["hero-caption"].body}</p>
              </div>

              <div className={styles.programHeroFactGrid}>
                {heroSignals.map((signal) => (
                  <article className={styles.programHeroFact} key={signal.label}>
                    <span>{signal.label}</span>
                    <strong>{signal.value}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.detailEvidenceSection}>
        <div className={`shell ${styles.detailEvidenceGrid}`}>
          {detailHighlights.map((item) => (
            <article className={styles.detailEvidenceCard} key={item.title}>
              <p className="eyebrow">{item.title}</p>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailSectionCard}>
            <div className={styles.detailSectionHeading}>
              <p className="eyebrow">{content["description-eyebrow"].title}</p>
              <h2>{content["description-section"].title}</h2>
            </div>

            <div className={styles.textStack}>
              {descriptionIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {(descriptionParagraphs.length > 0
                ? descriptionParagraphs
                : [getProgramCopy(program)]
              ).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

            <aside className={styles.programAsideCard}>
              <div className={styles.detailSectionHeading}>
                <p className="eyebrow">{content["admission-eyebrow"].title}</p>
                <h2>{content["admission-section"].title}</h2>
              </div>
              <p className={styles.programAsideLead}>
                Contacta con el equipo institucional para confirmar vacantes,
                turnos, documentos y continuidad del proceso.
              </p>
              <ul className={styles.noteList}>
                {admissionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className={styles.detailSectionCard}>
            <div className={styles.detailSectionHeading}>
              <p className="eyebrow">{content["study-plan-eyebrow"].title}</p>
              <h2>{content["study-plan-section"].title}</h2>
            </div>

            {studyPlanIntro.length > 0 ? (
              <div className={styles.textStack}>
                {studyPlanIntro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {studyPlanItems.length > 0 ? (
              studyPlanItems.length > 1 ? (
                <ol className={styles.studyPlanGrid}>
                  {studyPlanItems.map((item, index) => (
                    <li className={styles.studyPlanCard} key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.textStack}>
                  <p>{studyPlanItems[0]}</p>
                </div>
              )
            ) : (
              <div className={styles.textStack}>
                <p>{content["study-plan-empty"].body}</p>
              </div>
            )}
          </article>
        </div>
      </section>

      {relatedPrograms.length > 0 ? (
        <section className="section">
          <div className="shell">
            <div className="sectionHeader">
              <p className="eyebrow">{content["related-eyebrow"].title}</p>
              <h2>{content["related-section"].title}</h2>
              <p className="sectionCopy">{content["related-section"].body}</p>
            </div>

            <div className={styles.relatedProgramsGrid}>
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

      <section className="section contact" id="contacto">
        <div className="shell contactGrid">
          <div className={styles.contactPanel}>
            <p className="eyebrow">{content["contact-eyebrow"].title}</p>
            <h2>
              {content["contact-section"].title ||
                `Solicita orientación sobre ${program.title}`}
            </h2>
            <p>{content["contact-section"].body}</p>
            <div className={styles.contactSupportCard}>
              <strong>Respuesta institucional enfocada</strong>
              <p>
                Tu solicitud llega con la especialidad seleccionada para acelerar
                la primera respuesta administrativa.
              </p>
            </div>
          </div>
          <LeadForm initialProgramId={program.id} programs={programs} />
        </div>
      </section>
    </PublicSiteFrame>
  );
}
