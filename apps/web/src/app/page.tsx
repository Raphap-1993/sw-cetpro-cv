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
      "Formación técnico-productiva presencial, organizada como portal institucional y no solo como una campaña de matrícula.",
    body:
      "El CETPRO César Vallejo de Pucallpa presenta aquí su oferta académica, la ruta de admisión y la capa pública de gestión institucional en páginas separadas, con un tono más sobrio y verificable.",
    mediaUrl: "/brand/hero-campus.svg"
  },
  "intro-main": {
    title: "Institución orientada a práctica y continuidad formativa",
    body:
      "El sitio se reorganiza para que estudiantes y familias puedan entender qué ofrece el CETPRO, cómo se ingresa y qué evidencia institucional respalda el servicio educativo antes de iniciar contacto.",
    mediaUrl: null
  },
  "programs-header": {
    title: "Programas para revisar con más contexto",
    body:
      "Cada especialidad conduce a una ficha académica específica y a una página de admisión donde la consulta puede llegar con mejor contexto.",
    mediaUrl: null
  },
  "stats-header": {
    title: "Qué puedes resolver desde esta web",
    body:
      "Explora la institución, compara programas, revisa gestión institucional y ubica el libro de reclamaciones sin depender de una sola landing extensa.",
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
    title: "Gestión",
    body: "Licenciamiento e instrumentos de gestión",
    mediaUrl: null
  },
  "admission-main": {
    title: "Admisión con menos fricción",
    body:
      "La consulta de matrícula se mueve a una página propia para centralizar requisitos, pasos y la solicitud digital del estudiante.",
    mediaUrl: null
  },
  "cta-main": {
    title: "Gestión institucional visible, sin confundir web con expediente",
    body:
      "La capa pública de gestión ordena información y mejora trazabilidad, pero no reemplaza los documentos aprobados ni el respaldo documental exigible ante la autoridad.",
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
        "Identidad, enfoque formativo y señales de formalidad para entender la propuesta completa del CETPRO.",
      href: "/institucion"
    },
    {
      title: "Programas",
      body:
        "Catálogo comparativo con fichas académicas por especialidad, duración y modalidad.",
      href: "/programas"
    },
    {
      title: "Admisión",
      body:
        "Proceso, requisitos y formulario institucional para iniciar la consulta con mejor contexto.",
      href: "/admision"
    },
    {
      title: "Gestión institucional",
      body:
        "Licenciamiento, PEI, RI, PAT y seguimiento institucional organizados como evidencia pública.",
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
      value: "Oferta académica, admisión y gestión institucional"
    },
    {
      label: "Libro de reclamaciones",
      value: "Visible desde la navegación principal"
    }
  ];

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.homeHero}>
        <div className={`shell ${styles.homeHeroGrid}`}>
          <div>
            <p className={styles.pageLabel}>Portal institucional</p>
            <h1 className={styles.homeTitle}>{homeContent["hero-main"].title}</h1>
            <p className={styles.homeLead}>{homeContent["hero-main"].body}</p>

            <div className={styles.actionRow}>
              <Link className={styles.primaryLink} href="/programas">
                Explorar programas
              </Link>
              <Link className={styles.secondaryLink} href="/admision">
                Ir a admisión
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
            <p className={styles.pageLabel}>Mapa de páginas</p>
            <h2>{homeContent["programs-header"].title}</h2>
            <p>{homeContent["programs-header"].body}</p>
          </div>

          <div className={styles.quickGrid}>
            {homeActions.map((item) => (
              <article className={styles.quickCard} key={item.href}>
                <span className={styles.quickCardMeta}>Ruta pública</span>
                <h3 className={styles.quickCardTitle}>{item.title}</h3>
                <p>{item.body}</p>
                <Link className={styles.quickCardLink} href={item.href}>
                  Abrir página
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
            <h2>Especialidades visibles con acceso directo a su ficha.</h2>
            <p>
              El catálogo ahora se lee como un conjunto de páginas conectadas:
              catálogo comparativo, ficha de programa y admisión.
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
                <span className={styles.documentMeta}>Documento / evaluación</span>
                <h3 className={styles.documentCardTitle}>{document.title}</h3>
                <p>{document.summary}</p>
                <Link
                  className={styles.documentCardLink}
                  href={`/gestion-institucional/${document.slug}`}
                >
                  Ver página resumen
                </Link>
              </article>
            ))}
          </div>

          <div className={styles.actionRow}>
            <Link className={styles.secondaryLink} href="/gestion-institucional">
              Abrir gestión institucional
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
                  web pública organiza el primer contacto y la lectura inicial de
                  la oferta desde {institutionDistrict}.
                </p>
              </div>
              <div className={styles.spacedBlock}>
                <Link className={styles.primaryLink} href="/admision">
                  Revisar proceso de admisión
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
