import Link from "next/link";
import type { Metadata } from "next";
import { listPageContent, type PublicContentBlock } from "@/lib/public-data";
import { PublicSiteFrame } from "./components/PublicSiteFrame";
import { ProgramCard } from "./programas/ProgramCard";
import { getProgramCardCopy, getProgramsCatalogContent } from "./programas/content";
import { listPublishedPrograms } from "./programas/programs";
import styles from "./public-site.module.css";
import {
  getFeaturedManagementDocuments,
  institutionAddress,
  institutionDistrict
} from "./public-site";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "CETPRO Cesar Vallejo | Formación técnica presencial en Pucallpa",
    description:
      "Conoce la oferta académica, el proceso de admisión y la información institucional del CETPRO Cesar Vallejo de Pucallpa.",
    alternates: {
      canonical: "/"
    }
  };
}

type HomeContentKey =
  | "hero-main"
  | "intro-main"
  | "programs-header"
  | "stats-header"
  | "stats-item-01"
  | "stats-item-02"
  | "stats-item-03"
  | "admission-main"
  | "cta-main";

type HomeContentEntry = {
  body: string;
  mediaUrl: string | null;
  title: string;
};

const statKeys: HomeContentKey[] = [
  "stats-item-01",
  "stats-item-02",
  "stats-item-03"
];

const fallbackHomeContent: Record<HomeContentKey, HomeContentEntry> = {
  "hero-main": {
    title:
      "Formación técnico-productiva presencial para el desarrollo de competencias laborales.",
    body:
      "El CETPRO Cesar Vallejo de Pucallpa ofrece programas orientados a la práctica, la continuidad formativa y la atención responsable del estudiante. Consulte la oferta académica, el proceso de admisión y la información institucional.",
    mediaUrl: "/brand/hero-campus.svg"
  },
  "intro-main": {
    title: "Información para postulantes y familias",
    body:
      "Revise programas, requisitos de admisión, documentos institucionales y canales de atención en un mismo entorno oficial.",
    mediaUrl: null
  },
  "programs-header": {
    title: "Accesos principales",
    body:
      "Conozca la institución, revise la oferta académica y continúe con el proceso de admisión desde páginas dedicadas.",
    mediaUrl: null
  },
  "stats-header": {
    title: "Información institucional disponible",
    body:
      "Programas, admisión, documentos institucionales y libro de reclamaciones en un mismo sitio oficial.",
    mediaUrl: null
  },
  "stats-item-01": {
    title: "Programas",
    body: "Catálogo y fichas por especialidad",
    mediaUrl: null
  },
  "stats-item-02": {
    title: "Admisión",
    body: "Proceso y formulario institucional",
    mediaUrl: null
  },
  "stats-item-03": {
    title: "Documentos",
    body: "Gestión institucional de consulta pública",
    mediaUrl: null
  },
  "admission-main": {
    title: "Proceso de admisión",
    body:
      "Revisa requisitos, turnos y los datos necesarios para solicitar orientación al equipo administrativo.",
    mediaUrl: null
  },
  "cta-main": {
    title: "Documentos institucionales e información de consulta pública",
    body:
      "Consulte licenciamiento, instrumentos de gestión y páginas documentales preparadas para orientación, revisión y verificación externa.",
    mediaUrl: null
  }
};

async function getHomeContent(): Promise<Record<HomeContentKey, HomeContentEntry>> {
  const content = { ...fallbackHomeContent };
  const data = await listPageContent("home");

  for (const block of data as PublicContentBlock[]) {
    if (!(block.key in content)) {
      continue;
    }

    const key = block.key as HomeContentKey;
    content[key] = {
      title: block.title?.trim() || content[key].title,
      body: block.body?.trim() || content[key].body,
      mediaUrl: block.mediaUrl?.trim() || content[key].mediaUrl
    };
  }

  return content;
}

export default async function Home() {
  const [programs, homeContent, programsContent] = await Promise.all([
    listPublishedPrograms(),
    getHomeContent(),
    getProgramsCatalogContent()
  ]);
  const featuredPrograms = programs.slice(0, 3);
  const managementPreview = getFeaturedManagementDocuments();
  const programCardCopy = getProgramCardCopy(programsContent);
  const homeActions = [
    {
      title: "Institución",
      body:
        "Conoce la propuesta educativa, la modalidad presencial y la atención institucional del CETPRO.",
      href: "/institucion"
    },
    {
      title: "Oferta académica",
      body:
        "Revisa programas, duración, modalidad y orientación general de cada especialidad.",
      href: "/programas"
    },
    {
      title: "Admisión",
      body:
        "Consulta requisitos, pasos y el formulario para iniciar tu solicitud de orientación.",
      href: "/admision"
    },
    {
      title: "Gestión institucional",
      body:
        "Consulta documentos institucionales, instrumentos de gestión e información pública de referencia.",
      href: "/gestion-institucional"
    }
  ];
  const institutionalSignals = [
    {
      label: "Sede institucional",
      value: institutionAddress
    },
    {
      label: "Cobertura pública",
      value: "Programas, admisión y documentos institucionales"
    },
    {
      label: "Libro de reclamaciones",
      value: "Canal visible para atención al usuario"
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.homeHero}>
        <div className={`shell ${styles.homeHeroGrid}`}>
          <div>
            <p className={styles.pageLabel}>CETPRO Cesar Vallejo de Pucallpa</p>
            <h1 className={styles.homeTitle}>{homeContent["hero-main"].title}</h1>
            <p className={styles.homeLead}>{homeContent["hero-main"].body}</p>

            <div className={styles.actionRow}>
              <Link className={styles.primaryLink} href="/programas">
                Ver programas
              </Link>
              <Link className={styles.secondaryLink} href="/admision">
                Proceso de admisión
              </Link>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <p className={styles.pageLabel}>{homeContent["stats-header"].title}</p>
            <h2>{homeContent["intro-main"].title}</h2>
            <p>{homeContent["stats-header"].body}</p>
            <ul className={styles.heroList}>
              {statKeys.map((key) => (
                <li key={key}>
                  <strong>{homeContent[key].title}:</strong> {homeContent[key].body}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <div className={styles.sectionHeading}>
            <p className={styles.pageLabel}>Información y servicios</p>
            <h2>{homeContent["programs-header"].title}</h2>
            <p>{homeContent["programs-header"].body}</p>
          </div>

          <div className={styles.quickGrid}>
            {homeActions.map((item) => (
              <article className={styles.quickCard} key={item.href}>
                <span className={styles.quickCardMeta}>Página institucional</span>
                <h3 className={styles.quickCardTitle}>{item.title}</h3>
                <p>{item.body}</p>
                <Link className={styles.quickCardLink} href={item.href}>
                  Más información
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <div className={styles.sectionHeading}>
            <p className={styles.pageLabel}>Oferta destacada</p>
            <h2>Especialidades con ficha informativa y acceso directo a admisión.</h2>
            <p>
              Conozca cada programa, revise su orientación general y continúe con
              el proceso de admisión desde la misma ficha informativa.
            </p>
          </div>

          {featuredPrograms.length > 0 ? (
            <div className={styles.quickGrid}>
              {featuredPrograms.map((program) => (
                <ProgramCard key={program.id} copy={programCardCopy} program={program} />
              ))}
            </div>
          ) : null}

          <div className={styles.actionRow}>
            <Link className={styles.inlineLink} href="/programas">
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.stripGrid}`}>
          {institutionalSignals.map((signal) => (
            <article className={styles.stripCard} key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <div className={styles.sectionHeading}>
            <p className={styles.pageLabel}>Gestión institucional</p>
            <h2>{homeContent["cta-main"].title}</h2>
            <p>{homeContent["cta-main"].body}</p>
          </div>

          <div className={styles.documentGrid}>
            {managementPreview.map((document) => (
              <article className={styles.documentCard} key={document.slug}>
                <span className={styles.documentMeta}>Documento institucional</span>
                <h3 className={styles.documentCardTitle}>{document.title}</h3>
                <p>{document.summary}</p>
                <Link
                  className={styles.documentCardLink}
                  href={`/gestion-institucional/${document.slug}`}
                >
                  Más información
                </Link>
              </article>
            ))}
          </div>

          <div className={styles.actionRow}>
            <Link className={styles.secondaryLink} href="/gestion-institucional">
              Ver documentos institucionales
            </Link>
            <Link className={styles.secondaryLink} href="/libro-de-reclamaciones">
              Libro de reclamaciones
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <article className={styles.calloutCard}>
            <p className={styles.pageLabel}>{homeContent["admission-main"].title}</p>
            <div className={styles.splitGrid}>
              <div className={styles.spacedBlock}>
                <h2>{homeContent["admission-main"].body}</h2>
                <p className={styles.pageLeadStrong}>
                  La sede institucional se encuentra en {institutionAddress}. La
                  atención inicial permite orientar sobre programas, requisitos,
                  turnos y vacantes disponibles desde {institutionDistrict}.
                </p>
              </div>
              <div className={styles.spacedBlock}>
                <Link className={styles.primaryLink} href="/admision">
                  Proceso de admisión
                </Link>
                <Link className={styles.inlineLink} href="/institucion">
                  Conocer la institución
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
