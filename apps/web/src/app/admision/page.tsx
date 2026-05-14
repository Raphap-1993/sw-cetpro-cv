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
      title: "1. Revisa la oferta académica",
      body:
        "Consulta los programas disponibles e identifica la especialidad que mejor se ajusta a tu interés formativo."
    },
    {
      title: "2. Prepara tu solicitud",
      body:
        "Ten a la mano tu documento de identidad, datos de contacto y la consulta específica sobre vacantes, turnos o requisitos."
    },
    {
      title: "3. Recibe orientación institucional",
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
            <h2>{selectedProgram ? "Programa de interés registrado" : "Orientación previa"}</h2>
            <p>
              {selectedProgram
                ? `La solicitud puede enviarse con ${selectedProgram.title} como programa de interés.`
                : "Puedes solicitar orientación con o sin programa definido; la atención inicial te ayudará a resolver tu consulta."}
            </p>
            <ul className={styles.heroList}>
              <li>Atención sobre programas, turnos, requisitos y vacantes.</li>
              <li>Formulario institucional disponible para consultas iniciales.</li>
              <li>Respuesta según disponibilidad administrativa y programa consultado.</li>
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
