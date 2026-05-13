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
  hero: "/brand/hero-campus.svg",
  programs: {
    "apoyo-administrativo": "/brand/program-apoyo-administrativo.svg",
    "control-de-procesos-de-almacenamiento":
      "/brand/program-control-almacenamiento.svg",
    "estilismo-2": "/brand/program-estilismo.svg",
    "mantenimiento-de-sistemas-electronicos":
      "/brand/program-mantenimiento-electronico.svg",
    "panificacion-industrial-2": "/brand/program-panificacion-industrial.svg",
    "patronaje-2": "/brand/program-patronaje.svg",
    "programacion-de-sistemas-de-informacion":
      "/brand/program-programacion-sistemas.svg"
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
      "Formación técnico-productiva para integrarte al trabajo con práctica, criterio y continuidad formativa.",
    body:
      "CETPRO César Vallejo de Pucallpa forma estudiantes en rutas aplicadas de servicios, tecnología, confección, logística y producción, con orientación institucional desde la consulta hasta la matrícula.",
    mediaUrl: brandAssetPaths.hero,
    position: 0,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "intro-main",
    type: ContentBlockType.SECTION,
    title: "¿Quiénes somos?",
    body:
      "El CETPRO César Vallejo de Pucallpa es un centro de educación técnico-productiva orientado a la formación aplicada. Nuestra propuesta combina práctica guiada, evaluación por ciclos y una ruta académica clara para que cada estudiante avance con base técnica y acompañamiento institucional.",
    position: 10,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "programs-header",
    type: ContentBlockType.SECTION,
    title: "Oferta académica para aprender haciendo",
    body:
      "Especialidades y carreras técnicas diseñadas para desarrollar desempeño real, criterio técnico y una base productiva útil para empleo, continuidad formativa o emprendimiento.",
    position: 15,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-header",
    type: ContentBlockType.SECTION,
    title: "Admisión y orientación académica",
    body:
      "Consulta la oferta vigente, revisa duración y recibe orientación para elegir la especialidad que mejor responde a tu perfil y al momento de matrícula.",
    position: 20,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-01",
    type: ContentBlockType.TEXT,
    title: "6",
    body: "carreras técnicas",
    position: 21,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-02",
    type: ContentBlockType.TEXT,
    title: "1",
    body: "auxiliar técnico",
    position: 22,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "stats-item-03",
    type: ContentBlockType.TEXT,
    title: "2 años",
    body: "duración de los programas técnicos",
    position: 23,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "admission-main",
    type: ContentBlockType.SECTION,
    title: "Solicita orientación de matrícula",
    body:
      "Déjanos tus datos para revisar vacantes, turnos, requisitos y el programa de tu interés. El equipo administrativo te responde con la ruta de matrícula disponible para tu consulta.",
    position: 30,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "home",
    key: "cta-main",
    type: ContentBlockType.CTA,
    title: "Una formación pensada para desempeño técnico real",
    body:
      "El valor del CETPRO no está solo en la malla: está en la práctica guiada, la continuidad por ciclos y la claridad para avanzar hacia trabajo o emprendimiento con una base técnica sólida.",
    position: 40,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "seo",
    type: ContentBlockType.SECTION,
    title: "Programas | CETPRO Cesar Vallejo",
    body:
      "Explora la oferta académica del CETPRO César Vallejo de Pucallpa y compara cada programa desde una lectura institucional clara.",
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
      "Especialidades técnicas para construir base práctica, criterio profesional y continuidad formativa.",
    body:
      "Compara duración, modalidad y enfoque de cada especialidad para elegir una ruta formativa alineada con tu perfil, tu ritmo de estudio y tu proyección técnica.",
    position: 3,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-lead",
    type: ContentBlockType.SECTION,
    title: "Lead del catálogo",
    body:
      "Compara duracion, modalidad y enfoque de cada especialidad para elegir una ruta formativa alineada con tu perfil y tus objetivos.",
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
    title: "Cómo leer el catálogo",
    body: "",
    position: 6,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "programs",
    key: "hero-summary",
    type: ContentBlockType.SECTION,
    title: "Empieza con una comparación breve y luego profundiza en cada ficha",
    body:
      "Cada ficha resume enfoque, duración, modalidad y ruta de orientación para ayudarte a decidir con claridad antes de iniciar tu consulta de matrícula.",
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
    title: "Ver detalle",
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
      "Consulta la ficha pública del programa, revisa su orientación general y deja una solicitud con la especialidad preseleccionada.",
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
    title: "Perfil formativo, plan base y orientación de matrícula.",
    body:
      "La ficha pública resume la formación, el enfoque práctico y la ruta de orientación para continuar con el proceso de matrícula.",
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
    title: "Trayectoria formativa referencial",
    body:
      "El plan de estudio publicado sirve como referencia inicial para comprender la ruta formativa de la especialidad.",
    position: 14,
    status: PublishStatus.PUBLISHED
  },
  {
    page: "program-detail",
    key: "study-plan-empty",
    type: ContentBlockType.TEXT,
    title: "Pendiente",
    body:
      "El plan de estudio referencial se completará cuando el equipo institucional termine esta ficha académica.",
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
    title: "Explora otras rutas formativas",
    body:
      "Compara otras rutas formativas del CETPRO antes de tomar una decisión de matrícula.",
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
      "Déjanos tu nombre, celular y correo. El formulario ya llega con el programa seleccionado para reducir fricción en el primer contacto.",
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
    body: "Formación técnico-productiva presencial en Pucallpa",
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
        mediaUrl: isManagedLocalMediaUrl(existingBlock?.mediaUrl)
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
