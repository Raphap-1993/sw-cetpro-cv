export type PublicNavItem = {
  href: string;
  label: string;
};

export type ManagementDocument = {
  highlights: string[];
  legalSignals: string[];
  slug: string;
  summary: string;
  title: string;
  useCase: string;
};

export const institutionAddress = "Jr. Comandante Barrera 458, Pucallpa";
export const institutionDistrict = "Pucallpa, Ucayali";
export const publicNotesHref = "http://190.119.37.28:8085/apicetpro/#/login";
export const publicNotesLabel = "Mis Notas";
export const publicContactHref = "/contacto";

export const publicPrimaryNav: PublicNavItem[] = [
  { href: "/institucion", label: "Institución" },
  { href: "/programas", label: "Programas" },
  { href: "/admision", label: "Admisión" },
  { href: "/gestion-institucional", label: "Gestión institucional" },
  { href: "/libro-de-reclamaciones", label: "Reclamaciones" }
];

export const managementDocuments: ManagementDocument[] = [
  {
    slug: "licenciamiento-y-autorizaciones",
    title: "Licenciamiento y autorizaciones",
    summary:
      "Información institucional sobre resoluciones vigentes, oferta autorizada y alcance del servicio educativo.",
    useCase:
      "Reúne la información general sobre la resolución institucional, los programas autorizados y las referencias básicas de funcionamiento del CETPRO.",
    highlights: [
      "Resolución institucional vigente y alcance del servicio educativo.",
      "Oferta formativa declarada y modalidad de atención presencial.",
      "Referencias para consulta previa de estudiantes, familias y verificación externa."
    ],
    legalSignals: [
      "Presenta la base autorizada del servicio y la oferta formativa publicada.",
      "Facilita la verificación externa de la formalidad institucional."
    ]
  },
  {
    slug: "proyecto-educativo-institucional",
    title: "Proyecto Educativo Institucional (PEI)",
    summary:
      "Marco estratégico que ordena identidad, objetivos y prioridades del CETPRO.",
    useCase:
      "Resume la propuesta educativa, las prioridades institucionales y el horizonte formativo que orienta el servicio educativo.",
    highlights: [
      "Identidad institucional, propósito formativo y prioridades estratégicas.",
      "Diagnóstico institucional y foco de mejora para el periodo vigente.",
      "Alineamiento entre propuesta educativa, territorio y trayectoria del estudiante."
    ],
    legalSignals: [
      "El PEI es un instrumento central para comprender la orientación institucional.",
      "La información se presenta como resumen institucional para consulta general."
    ]
  },
  {
    slug: "reglamento-interno",
    title: "Reglamento Interno (RI)",
    summary:
      "Reglas de convivencia, organización académica y criterios básicos para la prestación del servicio.",
    useCase:
      "Reúne la información general sobre convivencia, atención administrativa y reglas básicas de funcionamiento para la comunidad educativa.",
    highlights: [
      "Reglas de funcionamiento, convivencia y atención administrativa.",
      "Criterios base para matrícula, permanencia y actuaciones internas.",
      "Canales para orientación, incidencias y resguardo de derechos."
    ],
    legalSignals: [
      "Su consulta facilita una lectura clara de derechos, deberes y procedimientos internos.",
      "La difusión institucional debe resguardar anexos o datos no preparados para publicación."
    ]
  },
  {
    slug: "plan-anual-de-trabajo",
    title: "Plan Anual de Trabajo (PAT)",
    summary:
      "Plan operativo que convierte prioridades institucionales en actividades, responsables y seguimiento.",
    useCase:
      "Presenta la agenda institucional del periodo, sus prioridades de gestión y el seguimiento general de actividades académicas y administrativas.",
    highlights: [
      "Prioridades anuales, actividades clave y calendarización institucional.",
      "Seguimiento operativo de metas académicas y administrativas.",
      "Relación entre objetivos del PEI y ejecución anual del servicio."
    ],
    legalSignals: [
      "El PAT permite verificar la planificación institucional del periodo.",
      "Su presentación pública puede mantenerse en formato de resumen o referencia institucional."
    ]
  },
  {
    slug: "seguimiento-y-mejora",
    title: "Seguimiento y mejora institucional",
    summary:
      "Información general sobre evaluación institucional, seguimiento y acciones de mejora.",
    useCase:
      "Consolida información general sobre seguimiento a egresados, revisión institucional y acciones orientadas a la mejora continua.",
    highlights: [
      "Seguimiento de egresados, empleabilidad y relación con sector productivo.",
      "Acciones de mejora, revisión anual y seguimiento institucional.",
      "Espacio para publicar anexos o reportes sin mezclar datos personales."
    ],
    legalSignals: [
      "La información se presenta en formato agregado y de consulta pública.",
      "Su difusión debe resguardar datos personales y reportes de uso interno."
    ]
  }
];

export type PublicVisualKey =
  | "home"
  | "institution"
  | "admission"
  | "programs"
  | "management"
  | "complaints";

const publicVisuals: Record<PublicVisualKey, string> = {
  home: "/brand/official-agreement-2026-04-21.jpg",
  institution: "/brand/official-agreement-2026-04-21.jpg",
  admission: "/brand/official-activity-barbering-2026-04-21.jpg",
  programs: "/brand/official-activity-electrical-2026-04-21.jpg",
  management: "/brand/official-agreement-2026-04-21.jpg",
  complaints: "/brand/official-agreement-2026-04-21.jpg"
};

export function getPublicVisual(key: PublicVisualKey) {
  return publicVisuals[key];
}

export function getManagementDocument(slug: string) {
  return managementDocuments.find((document) => document.slug === slug) ?? null;
}

export function getFeaturedManagementDocuments() {
  return managementDocuments.slice(0, 4);
}

export function getOfficialComplaintBookUrl() {
  const value = process.env.NEXT_PUBLIC_OFFICIAL_COMPLAINT_BOOK_URL?.trim();
  return value ? value : null;
}

export function getPublicWhatsAppHref() {
  const value = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  return value ? value : null;
}

export function buildAdmissionHref(programSlug?: string | null) {
  if (!programSlug) {
    return "/admision";
  }

  return `/admision?program=${encodeURIComponent(programSlug)}`;
}
