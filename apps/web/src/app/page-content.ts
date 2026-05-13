import "server-only";

import { listPageContent } from "@/lib/public-data";

type PageContentEntry = {
  body: string;
  mediaUrl: string | null;
  title: string;
};

type PageContentKey =
  | "seo"
  | "hero-eyebrow"
  | "hero-main"
  | "hero-body"
  | "hero-note"
  | "section-main"
  | "section-secondary"
  | "cta-primary"
  | "cta-secondary";

export type GenericPageContent = Record<PageContentKey, PageContentEntry>;

const pageFallbacks: Record<string, GenericPageContent> = {
  institucion: {
    seo: {
      title: "Institución | CETPRO Cesar Vallejo",
      body:
        "Conoce el enfoque institucional, la propuesta educativa y la base operativa del CETPRO César Vallejo de Pucallpa.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Institución",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Una institución técnico-productiva orientada a práctica, continuidad formativa y orden académico.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "Esta página resume identidad, propuesta educativa, señales de formalidad y el marco desde el cual se presenta la oferta pública del CETPRO.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Sede institucional",
      body: "Pucallpa, Ucayali",
      mediaUrl: null
    },
    "section-main": {
      title: "Qué explica esta institución",
      body:
        "La propuesta pública se organiza alrededor de formación presencial, rutas por ciclos y orientación institucional antes de matrícula.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Cómo leer el portal",
      body:
        "Programas, admisión, gestión institucional y libro de reclamaciones funcionan como páginas separadas para que cada decisión tenga un contexto claro.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Explorar programas",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Revisar admisión",
      body: "",
      mediaUrl: null
    }
  },
  admision: {
    seo: {
      title: "Admisión | CETPRO Cesar Vallejo",
      body:
        "Revisa requisitos, proceso y orientación de matrícula para iniciar tu consulta con el CETPRO César Vallejo.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Admisión",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title: "Admisión ordenada para elegir programa, validar requisitos y continuar la matrícula.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "Centralizamos proceso, requisitos y formulario en una sola página para que la consulta inicial sea más clara y menos dependiente de WhatsApp o visitas sin contexto.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Canal digital",
      body: "Formulario institucional",
      mediaUrl: null
    },
    "section-main": {
      title: "Qué necesitas antes de iniciar",
      body:
        "Programa de interés, datos de contacto, documento de identidad y una consulta específica sobre vacantes, turnos o requisitos.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Respuesta institucional",
      body:
        "El equipo administrativo revisa la solicitud y devuelve el siguiente paso según disponibilidad de atención y programa consultado.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Enviar solicitud",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Ver programas",
      body: "",
      mediaUrl: null
    }
  },
  "gestion-institucional": {
    seo: {
      title: "Gestión institucional | CETPRO Cesar Vallejo",
      body:
        "Resumen público de licenciamiento, instrumentos de gestión y evidencia institucional para consulta y evaluación.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Gestión institucional",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Una capa pública para licenciamiento, instrumentos de gestión y trazabilidad institucional.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "La web no reemplaza el expediente institucional, pero sí organiza evidencia pública para estudiantes, familias y procesos de evaluación.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Foco",
      body: "Formalidad y verificabilidad",
      mediaUrl: null
    },
    "section-main": {
      title: "Qué encontrarás aquí",
      body:
        "Páginas resumen sobre licenciamiento, PEI, RI, PAT y seguimiento institucional, con espacio para enlazar documentos aprobados o medios de verificación validados.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Criterio editorial",
      body:
        "Publicamos lo suficiente para orientar, acreditar orden institucional y mejorar transparencia, sin exponer datos personales ni sustituir el acervo oficial.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Ver programas",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Ir a admisión",
      body: "",
      mediaUrl: null
    }
  },
  "libro-de-reclamaciones": {
    seo: {
      title: "Libro de reclamaciones | CETPRO Cesar Vallejo",
      body:
        "Canal público para ubicar el libro de reclamaciones y entender el marco de atención según la naturaleza institucional del CETPRO.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Libro de reclamaciones",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Un canal visible para reclamos, con criterio claro sobre el régimen aplicable y la ruta oficial de atención.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "El libro de reclamaciones debe ser fácil de ubicar. Esta página separa orientación, datos mínimos y el enlace oficial cuando el régimen institucional lo requiera.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Visibilidad",
      body: "Enlace directo desde la navegación pública",
      mediaUrl: null
    },
    "section-main": {
      title: "Qué cubre esta página",
      body:
        "Explica el canal de reclamo, los datos que suele solicitar el registro y la diferencia entre el régimen de entidad pública y el régimen de proveedor.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Siguiente paso",
      body:
        "Si el enlace oficial aún no está configurado, esta página debe completarse con el URL o plataforma que corresponda al régimen definitivo de la institución.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Abrir libro oficial",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Solicitar orientación administrativa",
      body: "",
      mediaUrl: null
    }
  }
};

async function resolvePageContent(page: string) {
  const fallback = pageFallbacks[page];

  if (!fallback) {
    throw new Error(`No fallback content configured for page "${page}".`);
  }

  const content = { ...fallback };
  const data = await listPageContent(page);

  for (const block of data) {
    if (!(block.key in content)) {
      continue;
    }

    const key = block.key as PageContentKey;
    content[key] = {
      title: block.title?.trim() || content[key].title,
      body: block.body?.trim() || content[key].body,
      mediaUrl: block.mediaUrl?.trim() || content[key].mediaUrl
    };
  }

  return content;
}

export function getPageContent(page: keyof typeof pageFallbacks) {
  return resolvePageContent(page);
}
