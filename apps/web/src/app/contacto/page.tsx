import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/app/components/LeadForm";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getPageContent } from "@/app/page-content";
import styles from "@/app/public-site.module.css";
import {
  getPublicWhatsAppHref,
  institutionAddress,
  publicContactHref
} from "@/app/public-site";
import { listPublishedPrograms } from "@/app/programas/programs";
import { buildPageMetadata } from "@/lib/public-seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contacto");

  return buildPageMetadata({
    pageKey: "contacto",
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.body,
    canonicalPath: publicContactHref
  });
}

export default async function ContactPage() {
  const [content, programs] = await Promise.all([
    getPageContent("contacto"),
    listPublishedPrograms()
  ]);
  const whatsappHref = getPublicWhatsAppHref();
  const contactTopics = [
    "Programas técnicos presenciales y cuál puede ajustarse mejor a tu interés.",
    "Turnos, vacantes y orientación inicial para postular.",
    "Requisitos, siguiente paso y cómo iniciar tu proceso de admisión."
  ];

  return (
    <PublicSiteFrame>
      <section className={styles.pageHero} data-hero-section>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div className={styles.pageCopy} data-hero-copy>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb} data-hero-item>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <span>Contacto</span>
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
              {whatsappHref ? (
                <a
                  className={styles.primaryAction}
                  href={whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Escríbenos por WhatsApp
                </a>
              ) : null}
              <Link className={styles.secondaryAction} href="/programas">
                {content["cta-primary"].title}
              </Link>
              <Link className={styles.secondaryAction} href="/admision">
                {content["cta-secondary"].title}
              </Link>
            </div>
          </div>

          <aside className={`${styles.pagePanel} ${styles.pagePanelDark}`} data-hero-stage>
            <div className={styles.pagePanelBody}>
              <div data-hero-stage-item>
                <p className={styles.eyebrow}>{content["hero-note"].title}</p>
                <h2>{content["section-main"].title}</h2>
                <p>{content["section-main"].body}</p>
              </div>
              <div className={styles.summaryGrid} data-card-grid data-hero-stage-item>
                <article className={styles.summaryCard}>
                  <span>Atención</span>
                  <strong>Estudiantes, padres y familias</strong>
                </article>
                <article className={styles.summaryCard}>
                  <span>Sede</span>
                  <strong>{institutionAddress}</strong>
                </article>
                <article className={styles.summaryCard}>
                  <span>Canales</span>
                  <strong>WhatsApp y formulario</strong>
                </article>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.detailCard} data-reveal>
            <p className={styles.eyebrow}>{content["section-secondary"].title}</p>
            <h2>Te orientamos con un lenguaje claro y directo.</h2>
            <ul className={styles.noteList}>
              {contactTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard} data-reveal>
            <p className={styles.eyebrow}>Elige tu canal</p>
            <h2>Empieza por donde te resulte más cómodo.</h2>
            <p>
              Si tienes una duda puntual, WhatsApp suele ser el camino más rápido. Si
              quieres que te contactemos con más contexto, deja tus datos en el formulario.
            </p>
            {whatsappHref ? (
              <div className={styles.actionRow}>
                <a
                  className={styles.primaryAction}
                  href={whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Ir a WhatsApp
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className={styles.admissionSection}>
        <div className="shell">
          <div className={styles.sectionHeader} data-section-header>
            <p className={styles.eyebrow}>Formulario</p>
            <h2>Déjanos tus datos y te orientamos.</h2>
            <p>
              Cuéntanos qué programa te interesa o qué duda quieres resolver y te
              responderemos con el siguiente paso.
            </p>
          </div>

          <div className={styles.admissionGrid}>
            <div className={styles.admissionPanel} data-reveal>
              <LeadForm programs={programs} />
            </div>

            <aside className={styles.admissionPanel} data-reveal>
              <p className={styles.panelLabel}>Navegación útil</p>
              <div className={styles.textStack}>
                <div>
                  <h3>Programas</h3>
                  <p>Compara carreras técnicas presenciales antes de decidir.</p>
                </div>
                <div>
                  <h3>Admisión</h3>
                  <p>Revisa requisitos y el proceso si ya tienes claro tu siguiente paso.</p>
                </div>
              </div>
              <div className={styles.actionRow}>
                <Link className={styles.primaryAction} href="/programas">
                  Ver programas
                </Link>
                <Link className={styles.secondaryAction} href="/admision">
                  Ir a admisión
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
