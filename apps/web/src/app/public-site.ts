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

export const publicPrimaryNav: PublicNavItem[] = [
  { href: "/institucion", label: "Institución" },
  { href: "/programas", label: "Programas" },
  { href: "/admision", label: "Admisión" },
  { href: "/gestion-institucional", label: "Gestión" },
  { href: "/libro-de-reclamaciones", label: "Libro" }
];

export const managementDocuments: ManagementDocument[] = [
  {
    slug: "licenciamiento-y-autorizaciones",
    title: "Licenciamiento y autorizaciones",
    summary:
      "Resumen institucional de resoluciones vigentes, oferta autorizada y alcance operativo del CETPRO.",
    useCase:
      "Sirve como portada verificable para ubicar resolución institucional, programas autorizados y referencias de funcionamiento antes de matrícula o supervisión.",
    highlights: [
      "Resolución institucional vigente y alcance del servicio educativo.",
      "Oferta formativa declarada y locales de atención asociados.",
      "Relación entre programa publicado, condición del título y ruta de matrícula."
    ],
    legalSignals: [
      "Base operativa sobre régimen CETPRO y oferta formativa reconocida.",
      "Evidencia fuerte para consultas previas y evaluación de formalidad institucional."
    ]
  },
  {
    slug: "proyecto-educativo-institucional",
    title: "Proyecto Educativo Institucional (PEI)",
    summary:
      "Marco estratégico que ordena identidad, objetivos y prioridades del CETPRO.",
    useCase:
      "Permite explicar la propuesta educativa sin exponer el expediente completo, dejando una síntesis pública y espacio para enlazar el PDF aprobado.",
    highlights: [
      "Identidad institucional, propósito formativo y prioridades estratégicas.",
      "Diagnóstico institucional y foco de mejora para el periodo vigente.",
      "Alineamiento entre propuesta educativa, territorio y trayectoria del estudiante."
    ],
    legalSignals: [
      "El PEI aparece reiteradamente como instrumento de gestión clave en guías y expedientes de evaluación.",
      "La web no reemplaza el documento aprobado, pero sí mejora trazabilidad y consistencia pública."
    ]
  },
  {
    slug: "reglamento-interno",
    title: "Reglamento Interno (RI)",
    summary:
      "Reglas de convivencia, organización académica y criterios básicos para la prestación del servicio.",
    useCase:
      "Ordena información que estudiantes y familias necesitan antes de matrícula: funcionamiento, deberes, canales y criterios de atención.",
    highlights: [
      "Reglas de funcionamiento, convivencia y atención administrativa.",
      "Criterios base para matrícula, permanencia y actuaciones internas.",
      "Canales para orientación, incidencias y resguardo de derechos."
    ],
    legalSignals: [
      "En privado, el reglamento interno forma parte de la información previa que debe ser fácilmente accesible.",
      "No conviene publicar datos sensibles ni anexos internos que excedan el resumen institucional."
    ]
  },
  {
    slug: "plan-anual-de-trabajo",
    title: "Plan Anual de Trabajo (PAT)",
    summary:
      "Plan operativo que convierte prioridades institucionales en actividades, responsables y seguimiento.",
    useCase:
      "Da visibilidad a la agenda institucional anual y permite mostrar que la operación responde a planificación, no solo a campañas de matrícula.",
    highlights: [
      "Prioridades anuales, actividades clave y calendarización institucional.",
      "Seguimiento operativo de metas académicas y administrativas.",
      "Relación entre objetivos del PEI y ejecución anual del servicio."
    ],
    legalSignals: [
      "El PAT es una pieza recurrente en instrumentos de gestión y evaluación institucional.",
      "La publicación web puede quedarse en resumen ejecutivo y enlace al documento validado."
    ]
  },
  {
    slug: "seguimiento-y-mejora",
    title: "Seguimiento y mejora institucional",
    summary:
      "Página base para evidencias de evaluación, empleabilidad, seguimiento a egresados y mejora continua.",
    useCase:
      "Agrupa la capa de evidencia que una supervisión suele pedir: evaluación del PEI, seguimiento a egresados, alianzas y acciones de mejora.",
    highlights: [
      "Seguimiento de egresados, empleabilidad y relación con sector productivo.",
      "Acciones de mejora, revisión anual y trazabilidad institucional.",
      "Espacio para publicar anexos o reportes sin mezclar datos personales."
    ],
    legalSignals: [
      "El reglamento CETPRO contempla seguimiento a egresados dentro de la información académica oficial.",
      "La publicación debe cuidar datos personales y exponer solo información agregada o validada."
    ]
  }
];

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

export function buildAdmissionHref(programSlug?: string | null) {
  if (!programSlug) {
    return "/admision";
  }

  return `/admision?program=${encodeURIComponent(programSlug)}`;
}
