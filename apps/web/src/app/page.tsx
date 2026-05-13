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
    title:
      "Formación técnico-productiva para integrarte al trabajo con práctica, criterio y continuidad formativa.",
    body:
      "CETPRO César Vallejo de Pucallpa forma estudiantes en rutas aplicadas de servicios, tecnología, confección, logística y producción, con orientación institucional desde la consulta hasta la matrícula.",
    mediaUrl: "/brand/hero-campus.svg"
  },
  "intro-main": {
    title: "¿Quiénes somos?",
    body:
      "El CETPRO César Vallejo de Pucallpa es un centro de educación técnico-productiva orientado a la formación aplicada. Nuestra propuesta combina práctica guiada, evaluación por ciclos y una ruta académica clara para que cada estudiante avance con base técnica y acompañamiento institucional.",
    mediaUrl: null
  },
  "programs-header": {
    title: "Oferta académica para aprender haciendo",
    body:
      "Especialidades y carreras técnicas diseñadas para desarrollar desempeño real, criterio técnico y una base productiva útil para empleo, continuidad formativa o emprendimiento.",
    mediaUrl: null
  },
  "stats-header": {
    title: "Admisión y orientación académica",
    body:
      "Consulta la oferta vigente, revisa duración y recibe orientación para elegir la especialidad que mejor responde a tu perfil y al momento de matrícula.",
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
    title: "Solicita orientación de matrícula",
    body:
      "Déjanos tus datos para revisar vacantes, turnos, requisitos y el programa de tu interés. El equipo administrativo te responde con la ruta de matrícula disponible para tu consulta.",
    mediaUrl: null
  },
  "cta-main": {
    title: "Una formación pensada para desempeño técnico real",
    body:
      "El valor del CETPRO no está solo en la malla: está en la práctica guiada, la continuidad por ciclos y la claridad para avanzar hacia trabajo o emprendimiento con una base técnica sólida.",
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
        : `${modalities.size} modalidades vigentes`;
  const institutionalHighlights = [
    {
      title: "Sede institucional",
      body: institutionAddress
    },
    {
      title: "Oferta vigente",
      body: `${homeContent["stats-item-01"].title} ${homeContent["stats-item-01"].body} y ${homeContent["stats-item-02"].title} ${homeContent["stats-item-02"].body}.`
    },
    {
      title: "Certificación",
      body: "Certificado por ciclo y título técnico al culminar la carrera correspondiente."
    },
    {
      title: "Atención de matrícula",
      body: "Orientación institucional para revisar programa, modalidad, turnos y vacantes."
    }
  ];
  const academicPillars = [
    {
      title: "Aprendizaje aplicado",
      body:
        "Sesiones presenciales, práctica guiada y especialidades pensadas para desempeño real, continuidad formativa y criterio técnico."
    },
    {
      title: "Elección informada",
      body:
        "Catálogo público, fichas comparables y orientación inicial para elegir programa, turno y ruta de matrícula con mayor claridad."
    },
    {
      title: "Trayectoria certificable",
      body:
        "Cada ciclo acompaña el avance del estudiante con evidencias de aprendizaje y la proyección hacia un título técnico."
    }
  ];
  const institutionFacts = [
    "Atención presencial en Pucallpa con acompañamiento para vacantes y turnos.",
    "Ruta por ciclos con certificados de aprobación y continuidad hacia título técnico.",
    "Oferta pensada para estudiantes que requieren una decisión formativa clara y accionable."
  ];
  const catalogHighlights = [
    {
      value: `${programs.length || featuredPrograms.length || 0}`,
      label: "especialidades visibles"
    },
    {
      value: modalityLabel,
      label: "modalidad vigente"
    },
    {
      value: "Por ciclos",
      label: "ruta certificable"
    }
  ];
  const admissionSteps = [
    {
      title: "1. Explora la oferta",
      body:
        "Revisa programas, duración y modalidad para llegar a la consulta con una preferencia inicial."
    },
    {
      title: "2. Solicita orientación",
      body:
        "Comparte tus datos y el programa de interés para confirmar vacantes, turnos y requisitos de matrícula."
    },
    {
      title: "3. Continúa el proceso",
      body:
        "El equipo administrativo responde según disponibilidad para ordenar el siguiente paso de tu inscripción."
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
        { href: "#admision", label: "Admisión" },
        { href: "#contacto", label: "Contacto" }
      ]}
    >
      <section className="hero homeHero" style={heroBackground}>
        <div className="shell heroGrid">
          <div className="heroPanel">
            <div className="heroIdentityRow">
              <span className="heroIdentityBadge">Web institucional pública</span>
              <span className="heroIdentityBadge">Pucallpa, Ucayali</span>
            </div>
            <p className="eyebrow">CETPRO Cesar Vallejo de Pucallpa</p>
            <h1>{homeContent["hero-main"].title}</h1>
            <p className="lead">{homeContent["hero-main"].body}</p>
            <div className="heroMetaLine">
              <span>Formación presencial</span>
              <span>Orientación de matrícula</span>
              <span>Rutas técnicas con aplicación real</span>
            </div>

            <div className="actions">
              <Link href="/programas">Explorar programas</Link>
              <a className="secondary" href="#contacto">
                Solicitar orientación
              </a>
            </div>

            <div className="heroQuickFacts">
              {catalogHighlights.map((item) => (
                <article className="heroQuickFact" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="heroProofCard">
            <div className="heroProofHeader">
              <p className="eyebrow">Admisión y orientación</p>
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
              <li>Revisa la oferta vigente y compara especialidades.</li>
              <li>Define programa, modalidad y consulta de matrícula.</li>
              <li>Continúa con una ruta de atención institucional clara.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section trustSection">
        <div className="shell heroEvidenceGrid">
          {institutionalHighlights.map((item) => (
            <article className="evidenceCard" key={item.title}>
              <p className="eyebrow">{item.title}</p>
              <strong>{item.body}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="programas">
        <div className="shell">
          <div className="sectionSplit">
            <div className="sectionHeader">
              <p className="eyebrow">Programas</p>
              <h2>{homeContent["programs-header"].title}</h2>
              <p className="sectionCopy">{homeContent["programs-header"].body}</p>
            </div>

            <aside className="sectionNoteCard">
              <p className="eyebrow">Curaduría inicial</p>
              <h3>Empieza por una lectura comparativa y luego profundiza en cada ficha.</h3>
              <p>
                Esta portada prioriza una selección inicial para mostrar duración,
                modalidad, enfoque y continuidad hacia el detalle completo del
                programa.
              </p>
            </aside>
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
                      La oferta académica se encuentra en actualización.
                      Solicita orientación al equipo institucional para conocer
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
                Ver oferta académica completa
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section sectionMuted">
        <div className="shell">
          <div className="institutionGrid" id="cetpro">
            <article className="institutionNarrativeCard">
              <div className="sectionHeader">
                <p className="eyebrow">El CETPRO</p>
                <h2>{homeContent["intro-main"].title}</h2>
                <p className="sectionCopy">{homeContent["intro-main"].body}</p>
              </div>

              <div className="institutionSignalGrid">
                {academicPillars.map((pillar) => (
                  <article className="institutionSignalCard" key={pillar.title}>
                    <p className="eyebrow">{pillar.title}</p>
                    <p>{pillar.body}</p>
                  </article>
                ))}
              </div>
            </article>

            <aside className="institutionSummaryCard">
              <p className="eyebrow">Base institucional</p>
              <h3>{homeContent["cta-main"].title}</h3>
              <p>{homeContent["cta-main"].body}</p>

              <ul className="detailList">
                {institutionFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="section contact" id="admision">
        <div className="shell">
          <div className="sectionSplit">
            <div className="sectionHeader">
              <p className="eyebrow">Admisión</p>
              <h2>{homeContent["admission-main"].title}</h2>
              <p className="sectionCopy">{homeContent["admission-main"].body}</p>
            </div>

            <aside className="sectionNoteCard">
              <p className="eyebrow">Orientación institucional</p>
              <h3>Ruta clara desde la consulta digital hasta la atención administrativa.</h3>
              <p>
                La web pública funciona como primer punto de contacto para ordenar
                interés, documentos, turnos y continuidad del proceso de
                matrícula.
              </p>
            </aside>
          </div>

          <div className="contactGrid admissionExperienceGrid">
            <article className="admissionPanel">
              <div className="admissionStepsGrid">
                {admissionSteps.map((step) => (
                  <article className="admissionStep" key={step.title}>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>

              <ul className="detailList">
                <li>Orientación para vacantes, turnos y programa de interés.</li>
                <li>Respuesta administrativa para continuar el proceso de matrícula.</li>
                <li>Ubicación institucional: {institutionAddress}.</li>
              </ul>
            </article>

            <div className="formColumn" id="contacto">
              <div className="formIntroCard">
                <p className="eyebrow">Contacto</p>
                <h3>Deja tus datos y recibe acompañamiento inicial.</h3>
                <p>
                  El formulario centraliza nombre, contacto y programa de interés
                  para reducir fricción en la primera respuesta institucional.
                </p>
              </div>
              <LeadForm programs={programs} />
            </div>
          </div>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
