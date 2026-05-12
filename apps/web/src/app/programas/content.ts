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
      "Explora la oferta académica pública del CETPRO César Vallejo de Pucallpa y revisa el detalle de cada programa.",
    mediaUrl: null
  },
  "hero-back-link": {
    title: "← Volver al inicio",
    body: "",
    mediaUrl: null
  },
  "hero-eyebrow": {
    title: "Catálogo público",
    body: "",
    mediaUrl: null
  },
  "hero-main": {
    title: "Especialidades tecnicas para formarte con base practica y proyeccion laboral.",
    body:
      "Compara duracion, modalidad y enfoque de cada especialidad para elegir una ruta formativa alineada con tu perfil y tus objetivos.",
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
    title: "Resumen",
    body: "",
    mediaUrl: null
  },
  "hero-summary": {
    title: "Consulta la oferta vigente del CETPRO",
    body:
      "Cada ficha resume el enfoque de formacion, la duracion, la modalidad y la orientacion de matricula para ayudarte a decidir con claridad.",
    mediaUrl: null
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
    title: "Explora la oferta académica",
    body:
      "Revisa especialidades orientadas a servicios, tecnologia, confeccion, logistica y produccion con enfoque practico y aplicacion real.",
    mediaUrl: null
  },
  "empty-state": {
    title: "Catálogo en actualización",
    body:
      "La oferta academica se encuentra en actualizacion. Solicita orientacion al equipo institucional para conocer vacantes y especialidades disponibles.",
    mediaUrl: null
  },
  "card-eyebrow": {
    title: "Especialidad tecnica",
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
    title: "Ver detalle",
    body: "",
    mediaUrl: null
  }
};

const fallbackProgramDetailContent: ProgramDetailContent = {
  seo: {
    title: "CETPRO Cesar Vallejo",
    body:
      "Consulta la ficha pública del programa, revisa su orientación general y deja una solicitud con la especialidad preseleccionada.",
    mediaUrl: null
  },
  "hero-eyebrow": {
    title: "Detalle del programa",
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
    title: "Orientación",
    body: "",
    mediaUrl: null
  },
  "hero-caption": {
    title: "Perfil formativo, plan base y orientacion de matricula.",
    body:
      "Esta pagina resume la formacion, el enfoque practico y la ruta de orientacion para continuar con tu proceso de matricula.",
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
    title: "Lo que aprenderas en esta especialidad",
    body: "",
    mediaUrl: null
  },
  "admission-eyebrow": {
    title: "Admisión",
    body: "",
    mediaUrl: null
  },
  "admission-section": {
    title: "Proceso de orientacion y matricula",
    body:
      "Solicita orientación para confirmar vacantes y horarios.\nIndica tus datos de contacto y el programa de interés.\nEl equipo administrativo responderá según disponibilidad.",
    mediaUrl: null
  },
  "study-plan-eyebrow": {
    title: "Plan de estudio",
    body: "",
    mediaUrl: null
  },
  "study-plan-section": {
    title: "Trayectoria formativa referencial",
    body: "",
    mediaUrl: null
  },
  "study-plan-empty": {
    title: "",
    body:
      "El plan de estudio referencial se completara cuando el equipo institucional termine esta ficha academica.",
    mediaUrl: null
  },
  "related-eyebrow": {
    title: "También puede interesarte",
    body: "",
    mediaUrl: null
  },
  "related-section": {
    title: "Explora otras especialidades",
    body:
      "Compara otras rutas formativas del CETPRO antes de tomar una decision de matricula.",
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
      "Déjanos tu nombre, celular y correo. El formulario ya llega con el programa seleccionado para reducir fricción en el primer contacto.",
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
      "La especialidad solicitada no se encuentra disponible en la oferta academica actual.",
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
