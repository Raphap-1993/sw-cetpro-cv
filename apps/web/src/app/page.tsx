import Link from "next/link";
import type { Metadata } from "next";
import { listPageContent, type PublicContentBlock } from "@/lib/public-data";
import { LeadForm } from "./components/LeadForm";
import { PublicSiteFrame } from "./components/PublicSiteFrame";
import { ProgramCard } from "./programas/ProgramCard";
import {
  getProgramCardCopy,
  getProgramsCatalogContent
} from "./programas/content";
import { listPublishedPrograms } from "./programas/programs";

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

const institutionAddress = "Jr. Comandante Barrera 458, Pucallpa";

const fallbackHomeContent: Record<HomeContentKey, HomeContentEntry> = {
  "hero-main": {
    title: "Formacion tecnica para integrarte al trabajo y emprender con base practica.",
    body:
      "CETPRO Cesar Vallejo de Pucallpa ofrece formacion tecnico-productiva presencial en especialidades orientadas a servicios, tecnologia, confeccion, logistica y produccion.",
    mediaUrl: "/brand/hero-campus.svg"
  },
  "intro-main": {
    title: "¿Quiénes somos?",
    body:
      "El CETPRO César Vallejo de Pucallpa es un centro de educación técnico-productiva ubicado en el Jr. Comandante Barrera 458. Al cierre de cada ciclo el estudiante recibe un certificado de aprobación y al término de la carrera obtiene un título técnico en su especialidad.",
    mediaUrl: null
  },
  "programs-header": {
    title: "Oferta académica",
    body:
      "Una oferta pensada para aprender haciendo, desarrollar criterio tecnico y proyectarte al trabajo o al emprendimiento.",
    mediaUrl: null
  },
  "stats-header": {
    title: "Formacion presencial con enfoque aplicado",
    body:
      "Carreras tecnicas y auxiliar tecnico con acompanamiento para eleccion de especialidad, matricula y continuidad formativa.",
    mediaUrl: null
  },
  "stats-item-01": {
    title: "6",
    body: "carreras técnicas",
    mediaUrl: null
  },
  "stats-item-02": {
    title: "1",
    body: "auxiliar técnico",
    mediaUrl: null
  },
  "stats-item-03": {
    title: "2 años",
    body: "duración de los programas técnicos",
    mediaUrl: null
  },
  "admission-main": {
    title: "Solicita información para matrícula",
    body:
      "Para la matrícula se solicita copia de DNI ampliada, certificado de estudios original y fotos tamaño carnet. Déjanos tus datos y el equipo administrativo te orientará sobre turnos, vacantes y programa de interés.",
    mediaUrl: null
  },
  "cta-main": {
    title: "Especialidades pensadas para aprender, producir y proyectarte.",
    body:
      "Explora la oferta academica, compara duracion y modalidad, y solicita orientacion para elegir la ruta formativa que mejor se ajusta a tu perfil.",
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
  const featuredPrograms = programs.slice(0, 4);
  const programCardCopy = getProgramCardCopy(programsContent);
  const modalities = new Set(
    programs
      .map((program) => program.modality)
      .filter((modality): modality is string => !!modality)
  );
  const modalityLabel =
    modalities.size === 0
      ? "Presencial"
      : modalities.size === 1
        ? (Array.from(modalities)[0] ?? "Presencial")
        : `${modalities.size} modalidades activas`;
  const institutionalHighlights = [
    {
      title: "Oferta formativa",
      body: `${homeContent["stats-item-01"].title} ${homeContent["stats-item-01"].body} y ${homeContent["stats-item-02"].title} ${homeContent["stats-item-02"].body}.`
    },
    {
      title: "Modalidad",
      body: `${modalityLabel} con sesiones orientadas a la practica y al desarrollo de competencias.`
    },
    {
      title: "Certificacion",
      body: "Certificado por ciclo y titulo tecnico al culminar la carrera correspondiente."
    },
    {
      title: "Sede institucional",
      body: institutionAddress
    }
  ];

  const heroBackground = homeContent["hero-main"].mediaUrl
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(11, 99, 206, 0.92), rgba(16, 32, 51, 0.84)), url("${homeContent["hero-main"].mediaUrl}")`
      }
    : undefined;

  return (
    <PublicSiteFrame
      contactHref="#contacto"
      ctaHref="#contacto"
      navItems={[
        { href: "#programas", label: "Programas" },
        { href: "#cetpro", label: "El CETPRO" },
        { href: "#admision", label: "Admision" },
        { href: "#contacto", label: "Contacto" }
      ]}
    >
      <section className="hero homeHero" style={heroBackground}>
        <div className="shell heroGrid">
          <div className="heroPanel">
            <p className="eyebrow">CETPRO Cesar Vallejo de Pucallpa</p>
            <h1>{homeContent["hero-main"].title}</h1>
            <p className="lead">{homeContent["hero-main"].body}</p>
            <div className="heroMetaLine">
              <span>Formacion presencial</span>
              <span>Orientacion de matricula</span>
              <span>Proyeccion al trabajo y emprendimiento</span>
            </div>

            <div className="actions">
              <Link href="/programas">Explorar programas</Link>
              <a className="secondary" href="#contacto">
                Solicitar orientacion
              </a>
            </div>
          </div>

          <aside className="heroProofCard">
            <div className="heroProofHeader">
              <p className="eyebrow">Oferta academica y admision</p>
              <h2>{homeContent["stats-header"].title}</h2>
              <p>{homeContent["stats-header"].body}</p>
            </div>

            <div className="heroStatGrid">
              {statKeys.map((key) => (
                <article className="heroStatCard" key={key}>
                  <strong>{homeContent[key].title}</strong>
                  <span>{homeContent[key].body}</span>
                </article>
              ))}
            </div>

            <ul className="heroChecklist">
              <li>Aprendizaje practico orientado a desempeno real.</li>
              <li>Ruta formativa clara desde consulta hasta matricula.</li>
              <li>Oferta tecnica pensada para contexto local y empleabilidad.</li>
            </ul>
          </aside>
        </div>

        <div className="shell heroEvidenceGrid">
          {institutionalHighlights.map((item) => (
            <article className="evidenceCard" key={item.title}>
              <p className="eyebrow">{item.title}</p>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="programas">
        <div className="shell">
          <div className="sectionHeader">
            <p className="eyebrow">Programas</p>
            <h2>{homeContent["programs-header"].title}</h2>
            <p className="sectionCopy">{homeContent["programs-header"].body}</p>
          </div>

          <div className="programGrid">
            {programs.length > 0 ? (
              featuredPrograms.map((program) => (
                <ProgramCard copy={programCardCopy} key={program.id} program={program} />
              ))
            ) : (
              <article className="programCard">
                <div className="programCardBody">
                  <div className="programCardCopy">
                    <h3>Programas en preparacion</h3>
                    <p>
                      La oferta academica se encuentra en actualizacion.
                      Solicita orientacion al equipo institucional para conocer
                      vacantes y especialidades disponibles.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>

          {programs.length > 0 ? (
            <div className="sectionActions">
              <Link className="inlineAction" href="/programas">
                Ver oferta academica completa
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section sectionMuted">
        <div className="shell">
          <div className="sectionHeader">
            <p className="eyebrow">Por que estudiar aqui</p>
            <h2>{homeContent["cta-main"].title}</h2>
            <p className="sectionCopy">{homeContent["cta-main"].body}</p>
          </div>

          <div className="statsGrid">
            {statKeys.map((key) => (
              <article className="statCard" key={`proof:${key}`}>
                <strong className="statValue">{homeContent[key].title}</strong>
                <p>{homeContent[key].body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="cetpro">
        <div className="shell">
          <div className="sectionHeader">
            <p className="eyebrow">El CETPRO</p>
            <h2>{homeContent["intro-main"].title}</h2>
          </div>
          <article className="narrativeCard">
            <p className="sectionCopy">{homeContent["intro-main"].body}</p>
          </article>
        </div>
      </section>

      <section className="section contact" id="admision">
        <div className="shell contactGrid">
          <article className="admissionPanel">
            <p className="eyebrow">Admision</p>
            <h2>{homeContent["admission-main"].title}</h2>
            <p>{homeContent["admission-main"].body}</p>
            <ul className="detailList">
              <li>Orientacion para vacantes, turnos y programa de interes.</li>
              <li>Respuesta administrativa para continuar el proceso de matricula.</li>
              <li>Ubicacion institucional: {institutionAddress}.</li>
            </ul>
          </article>
          <div id="contacto">
            <LeadForm programs={programs} />
          </div>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
