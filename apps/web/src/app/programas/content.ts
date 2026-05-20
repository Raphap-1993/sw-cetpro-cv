import "server-only";

import { listPageContent } from "@/lib/public-data";

type ProgramPageContentEntry = {
  body: string;
  mediaUrl: string | null;
  title: string;
};

export type ProgramsCatalogContentKey =
  | "seo"
  | "hero-back-link"
  | "hero-eyebrow"
  | "hero-main"
  | "hero-primary-cta"
  | "hero-secondary-cta"
  | "hero-summary-eyebrow"
  | "hero-summary"
  | "hero-metric-programs"
  | "hero-metric-modalities"
  | "hero-metric-published"
  | "catalog-eyebrow"
  | "catalog-section"
  | "empty-state"
  | "card-eyebrow"
  | "card-duration-label"
  | "card-modality-label"
  | "card-cta";

export type ProgramDetailContentKey =
  | "seo"
  | "hero-eyebrow"
  | "hero-primary-cta"
  | "hero-secondary-cta"
  | "hero-caption-eyebrow"
  | "hero-caption"
  | "metric-duration-label"
  | "metric-modality-label"
  | "metric-study-plan-label"
  | "description-eyebrow"
  | "description-section"
  | "admission-eyebrow"
  | "admission-section"
  | "study-plan-eyebrow"
  | "study-plan-section"
  | "study-plan-empty"
  | "related-eyebrow"
  | "related-section"
  | "contact-eyebrow"
  | "contact-section"
  | "not-found-eyebrow"
  | "not-found"
  | "not-found-cta";

export type ProgramsCatalogContent = Record<
  ProgramsCatalogContentKey,
  ProgramPageContentEntry
>;

export type ProgramDetailContent = Record<
  ProgramDetailContentKey,
  ProgramPageContentEntry
>;

export const PROGRAMS_CATALOG_CONTENT_PAGE = "programs";
export const PROGRAM_DETAIL_CONTENT_PAGE = "program-detail";

const fallbackProgramsCatalogContent: ProgramsCatalogContent = {
  seo: {
    title: "Programas | CETPRO Cesar Vallejo",
    body:
      "Explora la oferta académica del CETPRO Cesar Vallejo de Pucallpa y conoce la información general de cada programa.",
    mediaUrl: null
  },
  "hero-back-link": {
    title: "← Volver al inicio",
    body: "",
    mediaUrl: null
  },
  "hero-eyebrow": {
    title: "Oferta académica",
    body: "",
    mediaUrl: null
  },
  "hero-main": {
    title:
      "Especialidades técnicas con formación presencial y orientación práctica.",
    body:
      "Conoce la duración, modalidad y enfoque general de cada programa para elegir la alternativa que mejor se ajuste a tu interés formativo.",
    mediaUrl: null
  },
  "hero-primary-cta": {
    title: "Ver programas",
    body: "",
    mediaUrl: null
  },
  "hero-secondary-cta": {
    title: "Solicitar información",
    body: "",
    mediaUrl: null
  },
  "hero-summary-eyebrow": {
    title: "Información del catálogo",
    body: "",
    mediaUrl: null
  },
  "hero-summary": {
    title: "Programas con información general para orientar tu elección",
    body:
      "Cada ficha presenta duración, modalidad, descripción general y acceso directo al proceso de admisión.",
    mediaUrl: "/brand/hero-campus-official.jpg"
  },
  "hero-metric-programs": {
    title: "Programas",
    body: "",
    mediaUrl: null
  },
  "hero-metric-modalities": {
    title: "Modalidad",
    body: "",
    mediaUrl: null
  },
  "hero-metric-published": {
    title: "Fichas activas",
    body: "",
    mediaUrl: null
  },
  "catalog-eyebrow": {
    title: "Programas",
    body: "",
    mediaUrl: null
  },
  "catalog-section": {
    title: "Explora la oferta académica vigente",
    body:
      "Revisa especialidades orientadas a servicios, tecnología, confección, logística y producción con una lectura comparativa antes de pasar al detalle.",
    mediaUrl: null
  },
  "empty-state": {
    title: "Catálogo en actualización",
    body:
      "La oferta académica se encuentra en actualización. Solicita orientación al equipo institucional para conocer vacantes y especialidades disponibles.",
    mediaUrl: null
  },
  "card-eyebrow": {
    title: "Especialidad técnica",
    body: "",
    mediaUrl: null
  },
  "card-duration-label": {
    title: "Duración",
    body: "",
    mediaUrl: null
  },
  "card-modality-label": {
    title: "Modalidad",
    body: "",
    mediaUrl: null
  },
  "card-cta": {
    title: "Ver programa",
    body: "",
    mediaUrl: null
  }
};

const fallbackProgramDetailContent: ProgramDetailContent = {
  seo: {
    title: "CETPRO Cesar Vallejo",
    body:
      "Consulta la ficha del programa, revisa su orientación general y continúa con el proceso de admisión.",
    mediaUrl: null
  },
  "hero-eyebrow": {
    title: "Ficha académica",
    body: "",
    mediaUrl: null
  },
  "hero-primary-cta": {
    title: "Solicitar información",
    body: "",
    mediaUrl: null
  },
  "hero-secondary-cta": {
    title: "Ver catálogo completo",
    body: "",
    mediaUrl: null
  },
  "hero-caption-eyebrow": {
    title: "Orientación institucional",
    body: "",
    mediaUrl: null
  },
  "hero-caption": {
    title: "Información general del programa.",
    body:
      "Consulta la descripción, duración, modalidad y orientación de admisión de esta especialidad.",
    mediaUrl: null
  },
  "metric-duration-label": {
    title: "Duración",
    body: "",
    mediaUrl: null
  },
  "metric-modality-label": {
    title: "Modalidad",
    body: "",
    mediaUrl: null
  },
  "metric-study-plan-label": {
    title: "Plan de estudio",
    body: "",
    mediaUrl: null
  },
  "description-eyebrow": {
    title: "Descripción",
    body: "",
    mediaUrl: null
  },
  "description-section": {
    title: "Lo que aprenderás en esta especialidad",
    body: "",
    mediaUrl: null
  },
  "admission-eyebrow": {
    title: "Admisión",
    body: "",
    mediaUrl: null
  },
  "admission-section": {
    title: "Proceso de orientación y matrícula",
    body:
      "Solicita orientación para confirmar vacantes y horarios.\nIndica tus datos de contacto y el programa de interés.\nEl equipo administrativo responderá según disponibilidad.\nTen a la mano DNI, constancias de estudio y consulta específica para agilizar la atención.",
    mediaUrl: null
  },
  "study-plan-eyebrow": {
    title: "Plan de estudio",
    body: "",
    mediaUrl: null
  },
  "study-plan-section": {
    title: "Plan de estudio",
    body: "",
    mediaUrl: null
  },
  "study-plan-empty": {
    title: "",
    body:
      "El detalle del plan de estudio se publicará cuando la institución autorice su difusión.",
    mediaUrl: null
  },
  "related-eyebrow": {
    title: "Otras especialidades",
    body: "",
    mediaUrl: null
  },
  "related-section": {
    title: "Otros programas de la oferta académica",
    body:
      "Revisa otras especialidades del CETPRO antes de iniciar tu solicitud.",
    mediaUrl: null
  },
  "contact-eyebrow": {
    title: "Contacto",
    body: "",
    mediaUrl: null
  },
  "contact-section": {
    title: "",
    body:
      "Déjanos tu nombre, celular y correo para recibir orientación sobre esta especialidad.",
    mediaUrl: null
  },
  "not-found-eyebrow": {
    title: "Catálogo",
    body: "",
    mediaUrl: null
  },
  "not-found": {
    title: "Programa no encontrado",
    body:
      "La especialidad solicitada no se encuentra disponible en la oferta académica actual.",
    mediaUrl: null
  },
  "not-found-cta": {
    title: "Volver a programas",
    body: "",
    mediaUrl: null
  }
};

async function resolveProgramPageContent<T extends string>(
  page: string,
  fallbackContent: Record<T, ProgramPageContentEntry>
) {
  const content = { ...fallbackContent };
  const data = await listPageContent(page);

  for (const block of data) {
    if (!(block.key in content)) {
      continue;
    }

    const key = block.key as T;
    content[key] = {
      title: block.title?.trim() || content[key].title,
      body: block.body?.trim() || content[key].body,
      mediaUrl: block.mediaUrl?.trim() || content[key].mediaUrl
    };
  }

  return content;
}

export async function getProgramsCatalogContent() {
  return resolveProgramPageContent(
    PROGRAMS_CATALOG_CONTENT_PAGE,
    fallbackProgramsCatalogContent
  );
}

export async function getProgramDetailContent() {
  return resolveProgramPageContent(
    PROGRAM_DETAIL_CONTENT_PAGE,
    fallbackProgramDetailContent
  );
}

export function getProgramCardCopy(content: ProgramsCatalogContent) {
  return {
    eyebrow: content["card-eyebrow"].title,
    durationLabel: content["card-duration-label"].title,
    modalityLabel: content["card-modality-label"].title,
    ctaLabel: content["card-cta"].title
  };
}
