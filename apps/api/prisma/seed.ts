import {
  ContentBlockType,
  MediaAssetType,
  PrismaClient,
  PublishStatus,
  UserRole
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type ProgramSeed = {
  description: string;
  duration: string;
  imageUrl: string;
  modality: string;
  position: number;
  slug: string;
  status: PublishStatus;
  studyPlan: string;
  summary: string;
  title: string;
};

type ContentBlockSeed = {
  body: string;
  key: string;
  mediaUrl?: string;
  page: string;
  position: number;
  status: PublishStatus;
  title: string;
  type: ContentBlockType;
};

type MediaAssetSeed = {
  altText?: string;
  source: "EXTERNAL_URL" | "LOCAL_UPLOAD";
  status: PublishStatus;
  storageKey?: string;
  title: string;
  type: MediaAssetType;
  url: string;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getManagedMediaBaseUrl() {
  const configuredBaseUrl = process.env.MEDIA_PUBLIC_BASE_URL?.trim();

  return configuredBaseUrl ? trimTrailingSlash(configuredBaseUrl) : null;
}

function isManagedLocalMediaUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  const managedBaseUrl = getManagedMediaBaseUrl();

  if (managedBaseUrl && value.startsWith(`${managedBaseUrl}/`)) {
    return true;
  }

  return value.startsWith("/media/") || value.includes("/media/");
}

const lockedContentMediaKeys = new Set([
  "home::hero-main",
  "institucion::hero-note",
  "admision::hero-note",
  "gestion-institucional::hero-note",
  "libro-de-reclamaciones::hero-note",
  "programs::hero-summary"
]);

function shouldPreserveExistingContentMedia(block: ContentBlockSeed, existingMediaUrl?: string | null) {
  if (!isManagedLocalMediaUrl(existingMediaUrl)) {
    return false;
  }

  return !lockedContentMediaKeys.has(`${block.page}::${block.key}`);
}

function shouldForceSeedAdminPasswordReset() {
  const normalized = process.env.SEED_ADMIN_FORCE_PASSWORD_RESET?.trim().toLowerCase();

  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function dedupeMediaAssetSeeds(seeds: MediaAssetSeed[]) {
  const uniqueSeeds = new Map<string, MediaAssetSeed>();

  for (const seed of seeds) {
    if (uniqueSeeds.has(seed.url)) {
      continue;
    }

    uniqueSeeds.set(seed.url, seed);
  }

  return Array.from(uniqueSeeds.values());
}

const brandAssetPaths = {
  hero: "/brand/hero-campus-official.jpg",
  programs: {
    "apoyo-administrativo": "/brand/program-apoyo-administrativo.png",
    "control-de-procesos-de-almacenamiento":
      "/brand/program-control-almacenamiento.png",
    "estilismo-2": "/brand/program-estilismo.png",
    "mantenimiento-de-sistemas-electronicos":
      "/brand/program-mantenimiento-electronico.png",
    "panificacion-industrial-2": "/brand/program-panificacion-industrial.png",
    "patronaje-2": "/brand/program-patronaje.png",
    "programacion-de-sistemas-de-informacion":
      "/brand/program-programacion-sistemas.png"
  }
} as const;

const programSeeds: ProgramSeed[] = [
  {
    title: "Apoyo Administrativo",
    slug: "apoyo-administrativo",
    summary:
      "Procesa documentación, gestiona información y brinda soporte administrativo con uso básico de TIC.",
    description:
      "El auxiliar técnico de apoyo administrativo está preparado para proveer información, procesar y custodiar documentación de distintas áreas de una organización, respetando procedimientos internos, normativa vigente y buenas prácticas de comunicación y servicio.",
    studyPlan:
      "Documentación empresarial, trámite documentario, organización de información y apoyo operativo a procesos administrativos.",
    duration: "1 año",
    modality: "Presencial",
    position: 0,
    imageUrl: brandAssetPaths.programs["apoyo-administrativo"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Estilismo",
    slug: "estilismo-2",
    summary:
      "Formación técnica en peluquería, barbería, maquillaje, manicure y pedicure con criterios de bioseguridad.",
    description:
      "El programa de Estilismo forma técnicos capaces de ejecutar servicios de peluquería y barbería, realizar procedimientos capilares, maquillaje de belleza y de caracterización, y aplicar técnicas de estética en manos y pies con enfoque práctico, higiénico y emprendedor.",
    studyPlan:
      "Peluquería, barbería y peinados; ondulación, laceado y tinturación; maquillaje, depilación y epilación; manicure y pedicure.",
    duration: "2 años",
    modality: "Presencial",
    position: 1,
    imageUrl: brandAssetPaths.programs["estilismo-2"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Patronaje",
    slug: "patronaje-2",
    summary:
      "Desarrollo de patrones, manejo de máquinas industriales y confección de prototipos con criterios de calidad.",
    description:
      "El técnico en Patronaje desarrolla patrones para prendas en tejido plano y de punto, opera y mantiene máquinas industriales y ejecuta procesos de trazado, tizado, corte y confección según ficha técnica, seguridad y estándares de calidad.",
    studyPlan:
      "Operatividad de máquinas industriales, patronaje, trazado y confección de prototipos para prendas de vestir.",
    duration: "2 años",
    modality: "Presencial",
    position: 2,
    imageUrl: brandAssetPaths.programs["patronaje-2"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Panificación Industrial",
    slug: "panificacion-industrial-2",
    summary:
      "Procesos de producción alimentaria con énfasis en mezclado, tratamiento térmico, seguridad y presentación del producto.",
    description:
      "Panificación Industrial prepara técnicos para recepcionar, acondicionar, pesar y mezclar materias primas, aplicar tratamientos térmicos y procedimientos de biotecnología y ejecutar operaciones de envasado y presentación de productos alimenticios bajo criterios de seguridad alimentaria.",
    studyPlan:
      "Operatividad y mantenimiento de equipos, seguridad alimentaria y procesos de producción panificadora.",
    duration: "2 años",
    modality: "Presencial",
    position: 3,
    imageUrl: brandAssetPaths.programs["panificacion-industrial-2"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Control de Procesos de Almacenamiento",
    slug: "control-de-procesos-de-almacenamiento",
    summary:
      "Gestión operativa del almacenamiento, control de bienes y soporte logístico según políticas y normativa.",
    description:
      "El programa desarrolla competencias para supervisar y ejecutar actividades de almacenamiento de productos, organizar inventarios, aplicar procedimientos logísticos y operar conforme a políticas internas, normativa vigente y buenas prácticas de trabajo en equipo.",
    studyPlan:
      "Almacenamiento de bienes, transporte logístico y control operativo de procesos de inventario y despacho.",
    duration: "2 años",
    modality: "Presencial",
    position: 4,
    imageUrl:
      brandAssetPaths.programs["control-de-procesos-de-almacenamiento"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Programación de Sistemas de Información",
    slug: "programacion-de-sistemas-de-informacion",
    summary:
      "Desarrollo de software, soporte informático y construcción de sistemas con buenas prácticas de programación y seguridad.",
    description:
      "El técnico en Programación de Sistemas de Información participa en la construcción y prueba de programas y servicios durante la implementación de soluciones, de acuerdo con diseño funcional, estándares de TI, seguridad y buenas prácticas de desarrollo.",
    studyPlan:
      "Soporte informático, desarrollo de software y bases para la implementación de aplicaciones y servicios digitales.",
    duration: "2 años",
    modality: "Presencial",
    position: 5,
    imageUrl:
      brandAssetPaths.programs["programacion-de-sistemas-de-informacion"],
    status: PublishStatus.PUBLISHED
  },
  {
    title: "Mantenimiento de Sistemas Electrónicos",
    slug: "mantenimiento-de-sistemas-electronicos",
    summary:
      "Instalación, asistencia e implementación de sistemas eléctricos y electrónicos para servicios e industria.",
    description:
      "El programa forma técnicos capaces de asistir en la implementación y operación de sistemas de alimentación eléctrica, instalar elementos de conducción de energía y comunicaciones, y participar en la implementación de sistemas electrónicos programables para servicios e industria.",
    studyPlan:
      "Instalaciones eléctricas, implementación de sistemas electrónicos y soporte técnico para procesos productivos y de servicios.",
    duration: "2 años",
    modality: "Presencial",
    position: 6,
    imageUrl:
      brandAssetPaths.programs["mantenimiento-de-sistemas-electronicos"],
    status: PublishStatus.PUBLISHED
  }
];

const contentBlockSeeds: ContentBlockSeed[] = [
  {
    page: "home",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title:
      "Formación técnica presencial para incorporarte al trabajo.",
    body:
      "Conoce programas, proceso de admisión e información institucional del CETPRO Cesar Vallejo de Pucallpa con una propuesta clara, práctica y presencial.",
    mediaUrl: brandAssetPaths.hero,
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "intro-main",
    type: ContentBlockType.SECTION,
    title: "Información clara para elegir, postular y verificar a la institución.",
    body:
      "Programas, admisión, gestión institucional y canales formales reunidos en un portal público con mejor jerarquía y lectura.",
    position: 10,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "programs-header",
    type: ContentBlockType.SECTION,
    title: "Revisa la oferta académica vigente y elige tu especialidad.",
    body:
      "Consulta cada programa, su duración, modalidad y orientación general para decidir con mayor claridad.",
    position: 15,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-header",
    type: ContentBlockType.SECTION,
    title: "Desliza los programas y abre la ficha que más te interesa.",
    body:
      "Cada tarjeta resume modalidad, duración y enfoque del programa para ayudarte a elegir con mayor claridad.",
    position: 20,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-01",
    type: ContentBlockType.TEXT,
    title: "Programas",
    body: "Revisa programas, duración y orientación general de cada especialidad.",
    position: 21,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-02",
    type: ContentBlockType.TEXT,
    title: "Admisión",
    body: "Encuentra pasos, requisitos y orientación previa para postular.",
    position: 22,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-03",
    type: ContentBlockType.TEXT,
    title: "Documentos",
    body: "Accede a licenciamiento, reglamentos y otros documentos oficiales.",
    position: 23,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "admission-main",
    type: ContentBlockType.SECTION,
    title: "Empieza tu proceso de admisión con información clara.",
    body:
      "Conoce los requisitos, prepara tus datos y solicita orientación sobre vacantes, turnos y el programa que te interesa.",
    position: 30,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "cta-main",
    type: ContentBlockType.CTA,
    title: "Consulta información y documentos oficiales de la institución.",
    body:
      "Revisa licenciamiento, reglamento interno y otros documentos que te ayudarán a conocer mejor el CETPRO y verificar su información institucional.",
    position: 40,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Institución | CETPRO Cesar Vallejo de Pucallpa",
    body:
      "Conoce la propuesta educativa, la modalidad presencial y los principales datos institucionales del CETPRO Cesar Vallejo de Pucallpa.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Institución",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title:
      "Formación presencial con enfoque práctico y atención institucional cercana.",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "hero-body",
    type: ContentBlockType.SECTION,
    title: "",
    body:
      "El CETPRO Cesar Vallejo brinda formación presencial con enfoque aplicado, acompañamiento formativo y una propuesta educativa vinculada a las necesidades del entorno.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "hero-note",
    type: ContentBlockType.TEXT,
    title: "Atención institucional",
    body: "Pucallpa, Ucayali",
    mediaUrl: brandAssetPaths.hero,
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "section-main",
    type: ContentBlockType.SECTION,
    title: "Propuesta educativa",
    body:
      "Conoce la propuesta educativa, la modalidad presencial y la información esencial para evaluar la institución con claridad.",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "section-secondary",
    type: ContentBlockType.SECTION,
    title: "Perfil institucional",
    body:
      "Ubica la sede, la modalidad de estudio y los canales de orientación para resolver consultas sobre la propuesta educativa.",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "cta-primary",
    type: ContentBlockType.TEXT,
    title: "Ver programas",
    body: "",
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "institucion",
    key: "cta-secondary",
    type: ContentBlockType.TEXT,
    title: "Proceso de admisión",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Admisión | CETPRO Cesar Vallejo de Pucallpa",
    body:
      "Revisa requisitos, pasos de admisión y canales de orientación para postular a los programas del CETPRO Cesar Vallejo de Pucallpa.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Admisión",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title: "Admisión y orientación para elegir tu programa con información clara.",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "hero-body",
    type: ContentBlockType.SECTION,
    title: "",
    body:
      "Revisa requisitos, pasos de orientación y el proceso para iniciar tu matrícula. El equipo administrativo atiende consultas sobre programas, turnos y vacantes.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "hero-note",
    type: ContentBlockType.TEXT,
    title: "Antes de iniciar",
    body: "Datos de contacto y programa de interés",
    mediaUrl: "/brand/logo-cesar-vallejo-blanco.png",
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "section-main",
    type: ContentBlockType.SECTION,
    title: "Requisitos para la orientación",
    body:
      "Programa de interés, datos de contacto, documento de identidad y una consulta específica sobre vacantes, turnos o requisitos.",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "section-secondary",
    type: ContentBlockType.SECTION,
    title: "Respuesta institucional",
    body:
      "El equipo administrativo revisa la solicitud y devuelve el siguiente paso según disponibilidad de atención y programa consultado.",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "cta-primary",
    type: ContentBlockType.TEXT,
    title: "Enviar solicitud",
    body: "",
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "admision",
    key: "cta-secondary",
    type: ContentBlockType.TEXT,
    title: "Ver programas",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Gestión institucional | CETPRO Cesar Vallejo",
    body:
      "Consulta documentos institucionales, instrumentos de gestión e información pública del CETPRO Cesar Vallejo de Pucallpa.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Gestión institucional",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title:
      "Documentos institucionales y referencias de consulta pública.",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "hero-body",
    type: ContentBlockType.SECTION,
    title: "",
    body:
      "Consulta documentos e información institucional de acceso público para estudiantes, familias y procesos de verificación externa.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "hero-note",
    type: ContentBlockType.TEXT,
    title: "Consulta documental",
    body: "Información institucional de acceso público",
    mediaUrl: "/brand/logo-cesar-vallejo-blanco.png",
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "section-main",
    type: ContentBlockType.SECTION,
    title: "Documentos institucionales",
    body:
      "Consulta licenciamiento, PEI, RI, PAT y seguimiento institucional desde páginas preparadas para lectura pública y verificación.",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "section-secondary",
    type: ContentBlockType.SECTION,
    title: "Consulta pública",
    body:
      "Aquí se reúne la información institucional autorizada para difusión y consulta pública.",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "cta-primary",
    type: ContentBlockType.TEXT,
    title: "Ver programas",
    body: "",
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "gestion-institucional",
    key: "cta-secondary",
    type: ContentBlockType.TEXT,
    title: "Proceso de admisión",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Libro de reclamaciones | CETPRO Cesar Vallejo",
    body:
      "Accede al libro de reclamaciones del CETPRO Cesar Vallejo y conoce la información necesaria para registrar tu solicitud de atención.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Libro de reclamaciones",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title:
      "Canal de atención para reclamos y seguimiento institucional.",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "hero-body",
    type: ContentBlockType.SECTION,
    title: "",
    body:
      "Este canal permite registrar reclamos y dar seguimiento a la atención correspondiente, conforme al régimen aplicable a la institución.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "hero-note",
    type: ContentBlockType.TEXT,
    title: "Registro de reclamos",
    body: "Datos de identificación y medio de contacto",
    mediaUrl: "/brand/logo-cesar-vallejo-blanco.png",
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "section-main",
    type: ContentBlockType.SECTION,
    title: "Información para el registro",
    body:
      "Revise el canal de atención, los datos necesarios para el registro y las referencias generales aplicables al tipo de reclamación.",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "section-secondary",
    type: ContentBlockType.SECTION,
    title: "Atención institucional",
    body:
      "Si requiere orientación sobre el canal aplicable o el estado de su atención, comuníquese con la institución mediante los canales administrativos disponibles.",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "cta-primary",
    type: ContentBlockType.TEXT,
    title: "Abrir libro oficial",
    body: "",
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "libro-de-reclamaciones",
    key: "cta-secondary",
    type: ContentBlockType.TEXT,
    title: "Solicitar orientación administrativa",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Programas | CETPRO Cesar Vallejo",
    body:
      "Explora la oferta académica del CETPRO Cesar Vallejo de Pucallpa y conoce la información general de cada programa.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-back-link",
    type: ContentBlockType.TEXT,
    title: "← Volver al inicio",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Oferta académica",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-main",
    type: ContentBlockType.HERO,
    title:
      "Especialidades técnicas con formación presencial y orientación práctica.",
    body:
      "Conoce la duración, modalidad y enfoque general de cada programa para elegir la alternativa que mejor se ajuste a tu interés formativo.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-lead",
    type: ContentBlockType.SECTION,
    title: "Lead del catálogo",
    body:
      "Conoce la duración, modalidad y orientación general de cada programa para elegir la alternativa que mejor se ajuste a tu interés formativo.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-primary-cta",
    type: ContentBlockType.TEXT,
    title: "Ver programas",
    body: "",
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-secondary-cta",
    type: ContentBlockType.TEXT,
    title: "Solicitar información",
    body: "",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-summary-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Información del catálogo",
    body: "",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-summary",
    type: ContentBlockType.SECTION,
    title: "Programas con información general para orientar tu elección",
    body:
      "Cada ficha presenta duración, modalidad, descripción general y acceso directo al proceso de admisión.",
    mediaUrl: brandAssetPaths.hero,
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-metric-programs",
    type: ContentBlockType.TEXT,
    title: "Programas",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-metric-modalities",
    type: ContentBlockType.TEXT,
    title: "Modalidad",
    body: "",
    position: 9,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-metric-published",
    type: ContentBlockType.TEXT,
    title: "Fichas activas",
    body: "",
    position: 10,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "catalog-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Programas",
    body: "",
    position: 11,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "catalog-section",
    type: ContentBlockType.SECTION,
    title: "Explora la oferta académica vigente",
    body:
      "Revisa especialidades orientadas a servicios, tecnología, confección, logística y producción con una lectura comparativa antes de pasar al detalle.",
    position: 12,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "card-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Especialidad técnica",
    body: "",
    position: 13,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "card-duration-label",
    type: ContentBlockType.TEXT,
    title: "Duración",
    body: "",
    position: 14,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "card-modality-label",
    type: ContentBlockType.TEXT,
    title: "Modalidad",
    body: "",
    position: 15,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "card-cta",
    type: ContentBlockType.TEXT,
    title: "Ver programa",
    body: "",
    position: 16,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "empty-state",
    type: ContentBlockType.SECTION,
    title: "Catálogo en actualización",
    body:
      "La oferta académica se encuentra en actualización. Solicita orientación al equipo institucional para conocer vacantes y especialidades disponibles.",
    position: 17,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "CETPRO Cesar Vallejo",
    body:
      "Consulta la ficha del programa, revisa su orientación general y continúa con el proceso de admisión.",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "hero-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Ficha académica",
    body: "",
    position: 1,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "hero-primary-cta",
    type: ContentBlockType.TEXT,
    title: "Solicitar información",
    body: "",
    position: 2,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "hero-secondary-cta",
    type: ContentBlockType.TEXT,
    title: "Ver catálogo completo",
    body: "",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "hero-caption-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Orientación institucional",
    body: "",
    position: 4,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "hero-caption",
    type: ContentBlockType.SECTION,
    title: "Información general del programa.",
    body:
      "Consulta la descripción, duración, modalidad y orientación de admisión de esta especialidad.",
    position: 5,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "metric-duration-label",
    type: ContentBlockType.TEXT,
    title: "Duración",
    body: "",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "metric-modality-label",
    type: ContentBlockType.TEXT,
    title: "Modalidad",
    body: "",
    position: 7,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "metric-study-plan-label",
    type: ContentBlockType.TEXT,
    title: "Plan de estudio",
    body: "",
    position: 8,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "description-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Descripción",
    body: "",
    position: 9,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "description-section",
    type: ContentBlockType.SECTION,
    title: "Lo que aprenderás en esta especialidad",
    body:
      "Esta ficha resume el perfil formativo, el enfoque práctico y los contenidos base declarados para la especialidad.",
    position: 10,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "admission-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Admisión",
    body: "",
    position: 11,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "admission-section",
    type: ContentBlockType.SECTION,
    title: "Proceso de orientación y matrícula",
    body:
      "Solicita orientación para confirmar vacantes y horarios.\nIndica tus datos de contacto y el programa de interés.\nEl equipo administrativo responderá según disponibilidad.\nTen a la mano DNI, constancias de estudio y consulta específica para agilizar la atención.",
    position: 12,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "study-plan-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Plan de estudio",
    body: "",
    position: 13,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "study-plan-section",
    type: ContentBlockType.SECTION,
    title: "Plan de estudio",
    body:
      "El plan de estudio publicado ofrece una referencia general sobre la formación de la especialidad.",
    position: 14,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "study-plan-empty",
    type: ContentBlockType.TEXT,
    title: "Pendiente",
    body:
      "El detalle del plan de estudio se publicará cuando la institución autorice su difusión.",
    position: 15,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "related-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Otras especialidades",
    body: "",
    position: 16,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "related-section",
    type: ContentBlockType.SECTION,
    title: "Otros programas de la oferta académica",
    body:
      "Revisa otras especialidades del CETPRO antes de iniciar tu solicitud.",
    position: 17,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "contact-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Contacto",
    body: "",
    position: 18,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "contact-section",
    type: ContentBlockType.SECTION,
    title: "Solicita orientación sobre este programa",
    body:
      "Déjanos tu nombre, celular y correo para recibir orientación sobre esta especialidad.",
    position: 19,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "not-found-eyebrow",
    type: ContentBlockType.TEXT,
    title: "Catálogo",
    body: "",
    position: 20,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "not-found",
    type: ContentBlockType.SECTION,
    title: "Programa no encontrado",
    body:
      "La especialidad solicitada no se encuentra disponible en la oferta académica actual.",
    position: 21,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "not-found-cta",
    type: ContentBlockType.TEXT,
    title: "Volver a programas",
    body: "",
    position: 22,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "site",
    key: "default-title",
    type: ContentBlockType.TEXT,
    title: "CETPRO Cesar Vallejo",
    body: "",
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "site",
    key: "default-description",
    type: ContentBlockType.TEXT,
    title: "",
    body:
      "Conoce la oferta académica, el proceso de admisión y la información institucional del CETPRO Cesar Vallejo de Pucallpa.",
    position: 1,
    status: PublishStatus.PUBLISHED
  }
];

const mediaAssetSeeds: MediaAssetSeed[] = dedupeMediaAssetSeeds([
  {
    title: "Hero institucional CETPRO",
    altText: "Estudiantes del CETPRO Cesar Vallejo en actividad institucional.",
    url: brandAssetPaths.hero,
    type: MediaAssetType.IMAGE,
    source: "EXTERNAL_URL",
    status: PublishStatus.PUBLISHED
  },
  ...programSeeds.map((program) => ({
    title: `Programa ${program.title}`,
    altText: `Imagen referencial del programa ${program.title}.`,
    url: program.imageUrl,
    type: MediaAssetType.IMAGE,
    source: "EXTERNAL_URL" as const,
    status: PublishStatus.PUBLISHED
  })),
  ...contentBlockSeeds
    .filter(
      (block): block is ContentBlockSeed & { mediaUrl: string } =>
        typeof block.mediaUrl === "string" && block.mediaUrl.length > 0
    )
    .map((block) => ({
      title: block.title || `Contenido ${block.page}/${block.key}`,
      altText:
        block.title || `Recurso visual asociado a ${block.page}/${block.key}.`,
      url: block.mediaUrl,
      type: MediaAssetType.IMAGE,
      source: "EXTERNAL_URL" as const,
      status: PublishStatus.PUBLISHED
    }))
]);

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@cetpro.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        ...(shouldForceSeedAdminPasswordReset() ? { passwordHash } : {})
      }
    });
  } else {
    await prisma.user.create({
      data: {
        name: "Admin CETPRO",
        email,
        passwordHash,
        role: UserRole.SUPER_ADMIN
      }
    });
  }

  await prisma.program.deleteMany({
    where: { slug: "programa-demo" }
  });

  for (const program of programSeeds) {
    const existingProgram = await prisma.program.findUnique({
      where: { slug: program.slug }
    });

    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        ...program,
        imageUrl: isManagedLocalMediaUrl(existingProgram?.imageUrl)
          ? existingProgram?.imageUrl
          : program.imageUrl
      },
      create: program
    });
  }

  for (const block of contentBlockSeeds) {
    const existingBlock = await prisma.contentBlock.findUnique({
      where: {
        page_key: {
          page: block.page,
          key: block.key
        }
      }
    });

    await prisma.contentBlock.upsert({
      where: {
        page_key: {
          page: block.page,
          key: block.key
        }
      },
      update: {
        ...block,
        mediaUrl: shouldPreserveExistingContentMedia(block, existingBlock?.mediaUrl)
          ? existingBlock?.mediaUrl
          : block.mediaUrl
      },
      create: block
    });
  }

  for (const asset of mediaAssetSeeds) {
    const existingAssetByUrl = await prisma.mediaAsset.findUnique({
      where: { url: asset.url }
    });

    if (existingAssetByUrl) {
      await prisma.mediaAsset.update({
        where: { id: existingAssetByUrl.id },
        data: asset
      });
      continue;
    }

    const existingLocalAsset = await prisma.mediaAsset.findFirst({
      where: {
        title: asset.title,
        source: "LOCAL_UPLOAD"
      }
    });

    if (existingLocalAsset) {
      await prisma.mediaAsset.update({
        where: { id: existingLocalAsset.id },
        data: {
          altText: existingLocalAsset.altText ?? asset.altText,
          status: asset.status,
          type: asset.type
        }
      });
      continue;
    }

    await prisma.mediaAsset.create({
      data: asset
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
