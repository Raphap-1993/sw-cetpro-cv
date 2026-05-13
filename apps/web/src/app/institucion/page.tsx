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
        "La propuesta privilegia práctica guiada, trabajo por ciclos y lectura clara del desempeño esperado en cada especialidad."
    },
    {
      title: "Trayectoria entendible",
      body:
        "El sitio se organiza para que la ruta pública vaya de institución a programa y de programa a admisión, sin depender de una sola portada saturada."
    },
    {
      title: "Formalidad visible",
      body:
        "La nueva arquitectura expone mejor la oferta, la gestión institucional y el libro de reclamaciones como capas distintas."
    }
  ];
  const facts = [
    {
      label: "Ubicación",
      value: institutionAddress
    },
    {
      label: "Ámbito",
      value: institutionDistrict
    },
    {
      label: "Atención digital",
      value: "Admisión y solicitudes desde la web institucional"
    }
  ];
  const sections = [
    {
      title: "Qué explica esta página",
      body:
        "La identidad institucional ya no queda escondida dentro de una landing. Aquí se resume qué hace el CETPRO, cómo ordena su propuesta y por qué el portal se separa por páginas."
    },
    {
      title: "Qué puede esperar el visitante",
      body:
        "Un catálogo con mayor contexto, una admisión más operativa y una sección de gestión institucional pensada como evidencia pública, no como ornamento."
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
              <li>La marca y la navegación ahora priorizan claridad sobre ruido visual.</li>
              <li>Las decisiones de admisión se entienden mejor cuando cada tema vive en su página.</li>
              <li>La gestión institucional se expone como capa propia para mejorar verificabilidad.</li>
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
            <p className={styles.pageLabel}>Lectura recomendada</p>
            <h2>{content["section-secondary"].title}</h2>
            <ul className={styles.noteList}>
              <li>Institución para contexto general y señales de formalidad.</li>
              <li>Programas para comparar oferta y revisar fichas académicas.</li>
              <li>Admisión para requisitos, pasos y formulario institucional.</li>
              <li>Gestión institucional para documentos y evidencia pública.</li>
            </ul>
          </aside>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
