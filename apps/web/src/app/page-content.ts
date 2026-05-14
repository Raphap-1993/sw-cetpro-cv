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
      title: "Institución | CETPRO Cesar Vallejo de Pucallpa",
      body:
        "Conoce la propuesta educativa, la modalidad presencial y los principales datos institucionales del CETPRO Cesar Vallejo de Pucallpa.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Institución",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Una institución orientada a la formación práctica y al desarrollo de competencias para el trabajo.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "El CETPRO Cesar Vallejo brinda formación presencial con enfoque aplicado, acompañamiento formativo y una propuesta educativa vinculada a las necesidades del entorno.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Atención institucional",
      body: "Pucallpa, Ucayali",
      mediaUrl: null
    },
    "section-main": {
      title: "Propuesta educativa",
      body:
        "Formación presencial, orientación académica y acompañamiento inicial para quienes buscan desarrollar competencias para el trabajo.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Perfil institucional",
      body:
        "Ubique la sede, la modalidad de estudio y los canales de orientación para resolver consultas sobre la propuesta educativa.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Ver programas",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Proceso de admisión",
      body: "",
      mediaUrl: null
    }
  },
  admision: {
    seo: {
      title: "Admisión | CETPRO Cesar Vallejo de Pucallpa",
      body:
        "Revisa requisitos, pasos de admisión y canales de orientación para postular a los programas del CETPRO Cesar Vallejo de Pucallpa.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Admisión",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title: "Admisión para programas técnico-productivos presenciales.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "Revisa requisitos, pasos de orientación y el proceso para iniciar tu matrícula. El equipo administrativo atiende consultas sobre programas, turnos y vacantes.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Antes de iniciar",
      body: "Datos de contacto y programa de interés",
      mediaUrl: null
    },
    "section-main": {
      title: "Requisitos para la orientación",
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
        "Consulta documentos institucionales, instrumentos de gestión e información pública del CETPRO Cesar Vallejo de Pucallpa.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Gestión institucional",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Gestión institucional y documentos de consulta pública.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "Consulte documentos e información institucional de acceso público para estudiantes, familias y procesos de verificación externa.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Consulta documental",
      body: "Información institucional de acceso público",
      mediaUrl: null
    },
    "section-main": {
      title: "Documentos institucionales",
      body:
        "Consulte páginas informativas sobre licenciamiento, PEI, RI, PAT y seguimiento institucional, preparadas para orientación y consulta pública.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Consulta pública",
      body:
        "Aquí se reúne la información institucional autorizada para difusión y consulta pública.",
      mediaUrl: null
    },
    "cta-primary": {
      title: "Ver programas",
      body: "",
      mediaUrl: null
    },
    "cta-secondary": {
      title: "Proceso de admisión",
      body: "",
      mediaUrl: null
    }
  },
  "libro-de-reclamaciones": {
    seo: {
      title: "Libro de reclamaciones | CETPRO Cesar Vallejo",
      body:
        "Accede al libro de reclamaciones del CETPRO Cesar Vallejo y conoce la información necesaria para registrar tu solicitud de atención.",
      mediaUrl: null
    },
    "hero-eyebrow": {
      title: "Libro de reclamaciones",
      body: "",
      mediaUrl: null
    },
    "hero-main": {
      title:
        "Libro de reclamaciones y atención al usuario.",
      body: "",
      mediaUrl: null
    },
    "hero-body": {
      title: "",
      body:
        "Este canal permite registrar reclamos y dar seguimiento a la atención correspondiente, conforme al régimen aplicable a la institución.",
      mediaUrl: null
    },
    "hero-note": {
      title: "Registro de reclamos",
      body: "Datos de identificación y medio de contacto",
      mediaUrl: null
    },
    "section-main": {
      title: "Información para el registro",
      body:
        "Revise el canal de atención, los datos necesarios para el registro y las referencias generales aplicables al tipo de reclamación.",
      mediaUrl: null
    },
    "section-secondary": {
      title: "Atención institucional",
      body:
        "Si requiere orientación sobre el canal aplicable o el estado de su atención, comuníquese con la institución mediante los canales administrativos disponibles.",
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
