import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { LeadForm } from "@/app/components/LeadForm";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
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
  const steps = [
    {
      title: "1. Revisa la oferta",
      body:
        "Abre el catálogo, compara especialidades y llega a la consulta con una preferencia inicial."
    },
    {
      title: "2. Prepara tu solicitud",
      body:
        "Ten a la mano documento de identidad, datos de contacto y la duda concreta sobre vacantes, turnos o requisitos."
    },
    {
      title: "3. Continúa con el equipo administrativo",
      body:
        "La respuesta institucional ordena el siguiente paso según disponibilidad y programa consultado."
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
      title: "¿La web reemplaza la matrícula?",
      body:
        "No. La web ordena la consulta y reduce fricción inicial; la validación documental y el paso final siguen el proceso institucional."
    },
    {
      title: "¿Puedo escribir sin definir programa?",
      body:
        "Sí. El formulario admite consultas generales; si llegas desde una ficha, la especialidad puede quedar preseleccionada."
    },
    {
      title: "¿Qué mejora esta página frente a la landing anterior?",
      body:
        "Concentra proceso, requisitos y contacto en una sola página operativa, en lugar de dispersarlos en secciones largas."
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.pageHero}>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Admisión</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1 className={styles.pageTitle}>{content["hero-main"].title}</h1>
            <p className={styles.pageLead}>{content["hero-body"].body}</p>

            <div className={styles.actionRow}>
              <Link className={styles.secondaryLink} href="/programas">
                {content["cta-secondary"].title}
              </Link>
            </div>
          </div>

          <aside className={styles.sideNote}>
            <p className={styles.pageLabel}>{content["hero-note"].title}</p>
            <h2>{selectedProgram ? "Programa preseleccionado" : "Consulta abierta"}</h2>
            <p>
              {selectedProgram
                ? `La solicitud puede enviarse con ${selectedProgram.title} ya seleccionado.`
                : "Puedes consultar con o sin programa definido; la orientación inicial te ayuda a ordenar la decisión."}
            </p>
            <ul className={styles.heroList}>
              <li>Catálogo y admisión ahora se conectan por rutas reales.</li>
              <li>La consulta llega con mejor contexto al equipo administrativo.</li>
              <li>El formulario funciona como canal digital institucional vigente.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.panelGrid}`}>
          {steps.map((step) => (
            <article className={styles.panelCard} key={step.title}>
              <p className={styles.pageLabel}>Proceso</p>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.mainCard}>
            <p className={styles.pageLabel}>{content["section-main"].title}</p>
            <h2>Requisitos y señales para iniciar la orientación.</h2>
            <ul className={styles.detailList}>
              {requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard}>
            <p className={styles.pageLabel}>{content["section-secondary"].title}</p>
            <h2>Qué ocurre después del envío.</h2>
            <p>{content["section-secondary"].body}</p>
            {selectedProgram ? (
              <p className={styles.warningNote}>
                Solicitud asociada a <strong>{selectedProgram.title}</strong>.
              </p>
            ) : null}
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.mainCard}>
            <p className={styles.pageLabel}>{content["cta-primary"].title}</p>
            <LeadForm
              defaultProgramId={selectedProgram?.id}
              programs={programs}
            />
          </article>

          <aside className={styles.asideCard}>
            <p className={styles.pageLabel}>Preguntas frecuentes</p>
            <div className={styles.textStack}>
              {faqs.map((faq) => (
                <div key={faq.title}>
                  <h2>{faq.title}</h2>
                  <p>{faq.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
