import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { LeadForm } from "@/app/components/LeadForm";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { getPublicVisual, publicContactHref } from "@/app/public-site";
import { listPublishedPrograms } from "@/app/programas/programs";

export const dynamic = "force-dynamic";

type AdmissionPageProps = {
  searchParams: Promise<{ program?: string | string[] }>;
};

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("admision");

  return {
    title: content.seo.title,
    description: content.seo.body,
    alternates: {
      canonical: "/admision"
    }
  };
}

export default async function AdmissionPage({
  searchParams
}: AdmissionPageProps) {
  const [content, programs, params] = await Promise.all([
    getPageContent("admision"),
    listPublishedPrograms(),
    searchParams
  ]);
  const requestedSlug = getSearchValue(params.program);
  const selectedProgram =
    programs.find((program) => program.slug === requestedSlug) ?? null;
  const heroMediaUrl = getPublicVisual("admission");
  const heroMediaKind = "photo";
  const steps = [
    {
      title: "Revisa la oferta académica",
      body:
        "Consulta los programas disponibles e identifica la especialidad que mejor se ajusta a tu interés formativo."
    },
    {
      title: "Prepara tu solicitud",
      body:
        "Ten a la mano tu documento de identidad, datos de contacto y la consulta específica sobre vacantes, turnos o requisitos."
    },
    {
      title: "Recibe orientación institucional",
      body:
        "El equipo administrativo revisa tu solicitud y responde según el programa consultado y la disponibilidad de atención."
    }
  ];
  const requirements = [
    "Nombre completo, celular y correo operativo.",
    "Programa de interés o necesidad de orientación para definirlo.",
    "Consulta específica sobre vacantes, turnos o requisitos.",
    "Documento de identidad y constancias que puedan ser solicitadas luego."
  ];
  const faqs = [
    {
      title: "¿La solicitud equivale a la matrícula?",
      body:
        "No. La solicitud permite iniciar la orientación. La matrícula sigue el proceso institucional y la validación documental correspondiente."
    },
    {
      title: "¿Puedo solicitar orientación sin definir programa?",
      body:
        "Sí. El formulario admite consultas generales; si accedes desde una ficha, el programa puede quedar preseleccionado."
    },
    {
      title: "¿Qué datos conviene preparar antes del envío?",
      body:
        "Programa de interés, nombre completo, documento de identidad, medio de contacto y una consulta concreta sobre el proceso."
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Solicitar orientación">
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Admisión</span>
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
              <Link className={styles.secondaryAction} href="/programas">
                {content["cta-secondary"].title}
              </Link>
              <Link className={styles.secondaryAction} href={publicContactHref}>
                Hablar con orientación
              </Link>
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
                <h2>{selectedProgram ? "Programa de interés registrado" : "Orientación previa"}</h2>
                <p>
                  {selectedProgram
                    ? `La solicitud puede enviarse con ${selectedProgram.title} como programa de interés.`
                    : "Puedes solicitar orientación con o sin programa definido; la atención inicial te ayudará a resolver tu consulta."}
                </p>
              </div>
              <div className={styles.summaryGrid} data-card-grid data-hero-stage-item>
                <article className={styles.summaryCard}>
                  <span>Atención</span>
                  <strong>Programas, turnos y vacantes</strong>
                </article>
                <article className={styles.summaryCard}>
                  <span>Formulario</span>
                  <strong>Consulta inicial institucional</strong>
                </article>
                <article className={styles.summaryCard}>
                  <span>Seguimiento</span>
                  <strong>Respuesta según disponibilidad</strong>
                </article>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <div className={styles.featureGrid} data-feature-grid>
            {steps.map((step) => (
              <article className={styles.featureCard} key={step.title}>
                <p className={styles.eyebrow}>Proceso</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-main"].title}</p>
            <h2>Qué debes tener a la mano antes de iniciar la orientación.</h2>
            <ul className={styles.detailList}>
              {requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-secondary"].title}</p>
            <h2>Qué ocurre después del envío.</h2>
            <p>{content["section-secondary"].body}</p>
            {selectedProgram ? (
              <div className={styles.warningNote}>
                <strong>Programa seleccionado</strong>
                Solicitud asociada a {selectedProgram.title}.
              </div>
            ) : null}
            <div className={styles.actionRow}>
              <Link className={styles.inlineAction} href={publicContactHref}>
                Ir a contacto
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.admissionSection}>
        <div className="shell">
          <div className={styles.sectionHeader} data-section-header>
            <p className={styles.eyebrow}>{content["cta-primary"].title}</p>
            <h2>Completa tu solicitud de orientación.</h2>
            <p>
              Registra tu consulta para recibir atención sobre programas,
              requisitos, vacantes y turnos disponibles.
            </p>
          </div>

          <div className={styles.admissionGrid}>
            <div className={styles.admissionPanel} data-reveal>
              <LeadForm defaultProgramId={selectedProgram?.id} programs={programs} />
            </div>

            <aside className={styles.admissionPanel} data-reveal>
              <p className={styles.panelLabel}>Preguntas frecuentes</p>
              <div className={styles.textStack}>
                {faqs.map((faq) => (
                  <div key={faq.title}>
                    <h3>{faq.title}</h3>
                    <p>{faq.body}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
