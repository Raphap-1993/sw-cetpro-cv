import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import { buildPageMetadata } from "@/lib/public-seo";
import {
  getPublicVisual,
  institutionAddress,
  institutionDistrict,
  publicContactHref
} from "@/app/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("institucion");

  return buildPageMetadata({
    pageKey: "institucion",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: "/institucion",
    fallbackOgImageUrl: getPublicVisual("institution")
  });
}

export default async function InstitutionPage() {
  const content = await getPageContent("institucion");
  const heroMediaUrl = getPublicVisual("institution");
  const heroMediaKind = "photo";
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
        "La oferta busca responder a necesidades del entorno productivo y fortalecer la continuidad formativa."
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
        "La institución pone a disposición información sobre programas, requisitos de admisión y contacto inicial para que cada consulta llegue con contexto suficiente."
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Abrir admisión">
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Institución</span>
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
              <Link className={styles.primaryAction} href="/programas">
                {content["cta-primary"].title}
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
                <h2>{content["section-secondary"].title}</h2>
                <p>{content["section-secondary"].body}</p>
              </div>
              <div className={styles.summaryGrid} data-card-grid data-hero-stage-item>
                {facts.map((fact) => (
                  <article className={styles.summaryCard} key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <div className={styles.featureGrid} data-feature-grid>
            {pillars.map((pillar) => (
              <article className={styles.featureCard} key={pillar.title}>
                <p className={styles.eyebrow}>Pilar institucional</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-main"].title}</p>
            <div className={styles.textStack}>
              {sections.map((section) => (
                <div key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className={styles.asideCard} data-reveal>
            <p className={styles.eyebrow}>Consultas relacionadas</p>
            <h2>{content["section-secondary"].title}</h2>
            <ul className={styles.noteList}>
              <li>Programas para revisar la oferta académica y las fichas por especialidad.</li>
              <li>Contacto para resolver dudas de estudiantes, familias y público en general.</li>
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
