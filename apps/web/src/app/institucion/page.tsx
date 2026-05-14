import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { institutionAddress, institutionDistrict } from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("institucion");

  return {
    title: content.seo.title,
    description: content.seo.body,
    alternates: {
      canonical: "/institucion"
    }
  };
}

export default async function InstitutionPage() {
  const content = await getPageContent("institucion");
  const pillars = [
    {
      title: "Formación aplicada",
      body:
        "La propuesta educativa prioriza el aprendizaje práctico, el desarrollo de competencias y la preparación para el trabajo."
    },
    {
      title: "Acompañamiento formativo",
      body:
        "La atención institucional orienta al estudiante desde la elección del programa hasta la consulta inicial de admisión."
    },
    {
      title: "Vinculación con el entorno",
      body:
        "La oferta busca responder a necesidades reales del entorno productivo y fortalecer la continuidad formativa."
    }
  ];
  const facts = [
    {
      label: "Ubicación",
      value: institutionAddress
    },
    {
      label: "Modalidad",
      value: "Formación presencial"
    },
    {
      label: "Atención",
      value: `Orientación institucional en ${institutionDistrict}`
    }
  ];
  const sections = [
    {
      title: "Propuesta educativa",
      body:
        "El CETPRO Cesar Vallejo ofrece formación técnico-productiva presencial con orientación práctica y una atención inicial pensada para ayudar al estudiante a elegir con mayor claridad."
    },
    {
      title: "Atención al estudiante",
      body:
        "La institución pone a disposición información sobre programas, requisitos de admisión y documentos institucionales para que cada consulta llegue con contexto suficiente."
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
              <span>Institución</span>
            </nav>
            <p className={styles.pageLabel}>{content["hero-eyebrow"].title}</p>
            <h1 className={styles.pageTitle}>{content["hero-main"].title}</h1>
            <p className={styles.pageLead}>{content["hero-body"].body}</p>

            <div className={styles.actionRow}>
              <Link className={styles.primaryLink} href="/programas">
                {content["cta-primary"].title}
              </Link>
              <Link className={styles.secondaryLink} href="/admision">
                {content["cta-secondary"].title}
              </Link>
            </div>
          </div>

          <aside className={styles.sideNote}>
            <p className={styles.pageLabel}>{content["hero-note"].title}</p>
            <h2>{content["section-secondary"].title}</h2>
            <p>{content["section-secondary"].body}</p>
            <ul className={styles.heroList}>
              <li>Formación presencial orientada al desarrollo de competencias para el trabajo.</li>
              <li>Programas con información general y acceso al proceso de admisión.</li>
              <li>Canales institucionales para orientación, consulta pública y atención al usuario.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.statGrid}`}>
          {facts.map((fact) => (
            <article className={styles.statCard} key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.panelGrid}`}>
          {pillars.map((pillar) => (
            <article className={styles.panelCard} key={pillar.title}>
              <p className={styles.pageLabel}>Pilar institucional</p>
              <h2>{pillar.title}</h2>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.mainCard}>
            <p className={styles.pageLabel}>{content["section-main"].title}</p>
            <div className={styles.textStack}>
              {sections.map((section) => (
                <div key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className={styles.asideCard}>
            <p className={styles.pageLabel}>Consultas relacionadas</p>
            <h2>{content["section-secondary"].title}</h2>
            <ul className={styles.noteList}>
              <li>Programas para revisar la oferta académica y las fichas por especialidad.</li>
              <li>Admisión para conocer requisitos, pasos y orientación institucional.</li>
              <li>Gestión institucional para consultar documentos e información pública.</li>
              <li>Libro de reclamaciones para atención al usuario y seguimiento de reclamos.</li>
            </ul>
          </aside>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
