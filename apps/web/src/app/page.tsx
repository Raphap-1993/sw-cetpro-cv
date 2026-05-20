import Link from "next/link";
import type { Metadata } from "next";
import { listPageContent, type PublicContentBlock } from "@/lib/public-data";
import {
  HomeProgramsCarousel,
  type HomeProgramCarouselItem
} from "./components/HomeProgramsCarousel";
import { PublicSiteFrame } from "./components/PublicSiteFrame";
import { HomeHeroSlider, type HomeHeroSlide } from "./components/HomeHeroSlider";
import {
  getProgramCopy,
  getPublishedProgramBySlug,
  getProgramIllustrationUrl,
  getProgramPath,
  listPublishedPrograms,
  type PublicProgram
} from "./programas/programs";
import styles from "./public-site.module.css";
import {
  getFeaturedManagementDocuments,
  institutionAddress,
  institutionDistrict
} from "./public-site";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "CETPRO Cesar Vallejo | Formación técnica presencial en Pucallpa",
    description:
      "Conoce la oferta académica, el proceso de admisión y la información institucional del CETPRO Cesar Vallejo de Pucallpa.",
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

type HomeContentPayload = {
  content: Record<HomeContentKey, HomeContentEntry>;
  heroSlides: HomeHeroSlide[];
};

const defaultHomeHeroSlides: HomeHeroSlide[] = [
  {
    id: "home-slide-01",
    title: "Recorrido institucional",
    body:
      "Sede, programas y orientación institucional reunidos en una sola experiencia pública.",
    mediaUrl: "/brand/home-hero-temp-01.jpg"
  },
  {
    id: "home-slide-02",
    title: "Aprendizaje presencial",
    body: "Aulas activas, atención cercana y formación orientada a la práctica.",
    mediaUrl: "/brand/home-hero-temp-02.jpg"
  },
  {
    id: "home-slide-03",
    title: "Práctica guiada",
    body: "Talleres y acompañamiento docente para fortalecer competencias laborales.",
    mediaUrl: "/brand/home-hero-temp-03.jpg"
  }
];

const fallbackHomeContent: Record<HomeContentKey, HomeContentEntry> = {
  "hero-main": {
    title: "Formación técnica presencial para incorporarte al trabajo.",
    body:
      "Conoce programas, proceso de admisión e información institucional del CETPRO Cesar Vallejo de Pucallpa con una propuesta clara, práctica y presencial.",
    mediaUrl: defaultHomeHeroSlides[0].mediaUrl
  },
  "intro-main": {
    title: "Información clara para elegir, postular y verificar a la institución.",
    body:
      "Programas, admisión, gestión institucional y canales formales reunidos en un portal público con mejor jerarquía y lectura.",
    mediaUrl: null
  },
  "programs-header": {
    title: "Revisa la oferta académica vigente y elige tu especialidad.",
    body:
      "Consulta cada programa, su duración, modalidad y orientación general para decidir con mayor claridad.",
    mediaUrl: null
  },
  "stats-header": {
    title: "Desliza los programas y abre la ficha que más te interesa.",
    body:
      "Cada tarjeta resume modalidad, duración y enfoque del programa para ayudarte a elegir con mayor claridad.",
    mediaUrl: null
  },
  "stats-item-01": {
    title: "Programas",
    body: "Revisa programas, duración y orientación general de cada especialidad.",
    mediaUrl: null
  },
  "stats-item-02": {
    title: "Admisión",
    body: "Encuentra pasos, requisitos y orientación previa para postular.",
    mediaUrl: null
  },
  "stats-item-03": {
    title: "Documentos",
    body: "Accede a licenciamiento, reglamentos y otros documentos oficiales.",
    mediaUrl: null
  },
  "admission-main": {
    title: "Empieza tu proceso de admisión con información clara.",
    body:
      "Conoce los requisitos, prepara tus datos y solicita orientación sobre vacantes, turnos y el programa que te interesa.",
    mediaUrl: null
  },
  "cta-main": {
    title: "Consulta información y documentos oficiales de la institución.",
    body:
      "Revisa licenciamiento, reglamento interno y otros documentos que te ayudarán a conocer mejor el CETPRO y verificar su información institucional.",
    mediaUrl: null
  }
};

const homeHeroSlideKeyPattern = /^hero-slide-\d+$/;
type HomeLegacyCopyRule = {
  legacyBodies: string[];
  legacyTitles: string[];
  next: HomeContentEntry;
};

const homeLegacyCopyMap: Partial<Record<HomeContentKey, HomeLegacyCopyRule>> = {
  "programs-header": {
    legacyTitles: ["Explora la oferta académica y encuentra tu siguiente paso."],
    legacyBodies: [
      "La web organiza institución, programas, admisión y consulta pública como páginas conectadas, no como bloques aislados."
    ],
    next: fallbackHomeContent["programs-header"]
  },
  "stats-header": {
    legacyTitles: [
      "Oferta, admisión y consulta institucional",
      "¿Qué necesitas revisar antes de postular?"
    ],
    legacyBodies: [
      "Especialidades, orientación de admisión y documentos de consulta pública disponibles en un mismo portal.",
      "Usa estos accesos para conocer la institución, revisar la admisión o consultar documentos oficiales según el paso en el que te encuentres."
    ],
    next: fallbackHomeContent["stats-header"]
  },
  "stats-item-01": {
    legacyTitles: ["Programas"],
    legacyBodies: ["Especialidades con ficha y acceso directo a admisión"],
    next: fallbackHomeContent["stats-item-01"]
  },
  "stats-item-02": {
    legacyTitles: ["Admisión"],
    legacyBodies: ["Orientación inicial para resolver vacantes, turnos y requisitos"],
    next: fallbackHomeContent["stats-item-02"]
  },
  "stats-item-03": {
    legacyTitles: ["Gestión"],
    legacyBodies: ["Documentos e información institucional de consulta pública"],
    next: fallbackHomeContent["stats-item-03"]
  },
  "admission-main": {
    legacyTitles: ["Proceso de admisión"],
    legacyBodies: [
      "Revisa requisitos, turnos y los datos necesarios para solicitar orientación al equipo administrativo."
    ],
    next: fallbackHomeContent["admission-main"]
  },
  "cta-main": {
    legacyTitles: ["Documentos institucionales disponibles para consulta pública"],
    legacyBodies: [
      "Revisa licenciamiento, instrumentos de gestión y páginas de referencia preparadas para estudiantes, familias y procesos de verificación."
    ],
    next: fallbackHomeContent["cta-main"]
  }
};

function normalizeLegacyHomeContent(
  content: Record<HomeContentKey, HomeContentEntry>
): Record<HomeContentKey, HomeContentEntry> {
  const nextContent = { ...content };

  for (const [key, rule] of Object.entries(homeLegacyCopyMap)) {
    const contentKey = key as HomeContentKey;
    const current = nextContent[contentKey];

    if (!rule || !current) {
      continue;
    }

    const hasLegacyTitle = rule.legacyTitles.some(
      (legacyTitle) => current.title.trim() === legacyTitle
    );
    const hasLegacyBody = rule.legacyBodies.some(
      (legacyBody) => current.body.trim() === legacyBody
    );

    if (hasLegacyTitle || hasLegacyBody) {
      nextContent[contentKey] = {
        ...current,
        title: rule.next.title,
        body: rule.next.body
      };
    }
  }

  return nextContent;
}

function buildFallbackHomeHeroSlides(
  content: Record<HomeContentKey, HomeContentEntry>
): HomeHeroSlide[] {
  return defaultHomeHeroSlides.map((slide, index) => ({
    ...slide,
    title: index === 0 ? content["intro-main"].title : slide.title,
    body: index === 0 ? content["intro-main"].body : slide.body
  }));
}

function getProgramMediaKind(imageUrl: string | null) {
  const source = imageUrl?.trim();

  if (!source) {
    return "graphic" as const;
  }

  return source.startsWith("/brand/") ? ("graphic" as const) : ("photo" as const);
}

async function getHomeContent(): Promise<HomeContentPayload> {
  const content = { ...fallbackHomeContent };
  const heroSlides = new Map<string, HomeHeroSlide>();
  const data = await listPageContent("home");

  for (const block of data as PublicContentBlock[]) {
    if (homeHeroSlideKeyPattern.test(block.key)) {
      const mediaUrl = block.mediaUrl?.trim();

      if (mediaUrl) {
        heroSlides.set(block.key, {
          id: block.key,
          title: block.title?.trim() || "Galería institucional",
          body:
            block.body?.trim() ||
            "Fotografía institucional del CETPRO César Vallejo de Pucallpa.",
          mediaUrl
        });
      }
    }

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

  const resolvedSlides = Array.from(heroSlides.values()).sort((left, right) =>
    left.id.localeCompare(right.id)
  );

  return {
    content: normalizeLegacyHomeContent(content),
    heroSlides:
      resolvedSlides.length > 0
        ? resolvedSlides
        : buildFallbackHomeHeroSlides(content)
  };
}

async function getValidatedHomePrograms(): Promise<PublicProgram[]> {
  const programs = await listPublishedPrograms();

  if (programs.length === 0) {
    return [];
  }

  const validatedPrograms = await Promise.all(
    programs.map(async (program) => {
      const detail = await getPublishedProgramBySlug(program.slug);

      if (!detail) {
        return null;
      }

      return detail;
    })
  );

  return validatedPrograms.filter(
    (program): program is PublicProgram => program !== null
  );
}

export default async function Home() {
  const [programs, homePayload] = await Promise.all([
    getValidatedHomePrograms(),
    getHomeContent()
  ]);
  const { content: homeContent, heroSlides } = homePayload;
  const carouselPrograms: HomeProgramCarouselItem[] = programs.map((program) => {
    const referentialImageUrl = getProgramIllustrationUrl(program.slug, program.title, null);

    return {
      id: program.id,
      title: program.title,
      body: getProgramCopy(program),
      duration: program.duration ?? "Duración por confirmar",
      modality: program.modality ?? "Modalidad presencial",
      studyPlanLabel: program.studyPlan ? "Plan de estudio referencial" : "Ficha informativa",
      href: getProgramPath(program.slug),
      imageUrl: referentialImageUrl,
      fallbackImageUrl: referentialImageUrl,
      mediaKind: getProgramMediaKind(referentialImageUrl)
    };
  });
  const managementPreview = getFeaturedManagementDocuments().slice(0, 2);
  const admissionSteps = [
    {
      title: "Elige tu programa",
      copy:
        "Revisa las especialidades disponibles y define cuál deseas estudiar."
    },
    {
      title: "Prepara tus datos",
      copy:
        "Ten a la mano tu documento de identidad, tus datos de contacto y tus consultas."
    },
    {
      title: "Solicita orientación",
      copy:
        "Completa el formulario para recibir información sobre requisitos, vacantes y horarios."
    }
  ];
  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Abrir admisión">
      <section className={styles.homeHero} data-hero-section data-page="home">
        <HomeHeroSlider slides={heroSlides}>
          <div className={`shell ${styles.homeHeroOverlay}`}>
            <div className={`${styles.heroCopy} ${styles.heroCopyPanel}`} data-hero-copy>
              <p className={styles.eyebrow} data-hero-item>
                CETPRO César Vallejo · Pucallpa
              </p>
              <h1 className={styles.homeTitle} data-hero-item>
                {homeContent["hero-main"].title}
              </h1>
              <p className={styles.homeLead} data-hero-item>
                {homeContent["hero-main"].body}
              </p>
              <div className={styles.actionRow} data-hero-item>
                <Link className={styles.primaryAction} href="/programas">
                  Ver programas
                </Link>
                <Link className={styles.secondaryAction} href="/admision">
                  Revisar admisión
                </Link>
              </div>
            </div>
          </div>
        </HomeHeroSlider>
      </section>

      <section className={`${styles.systemSection} ${styles.homeSectionCompact}`}>
        <div className="shell">
          <div
            className={`${styles.sectionHeader} ${styles.homeSectionHeaderCompact}`}
            data-section-header
          >
            <h2>Programas de estudio</h2>
          </div>

          {carouselPrograms.length > 0 ? (
            <HomeProgramsCarousel programs={carouselPrograms} />
          ) : (
            <article className={`${styles.systemLead} ${styles.homeCardSpacious}`} data-reveal>
              <p className={styles.eyebrow}>Catálogo en sincronización</p>
              <h2>Los programas publicados volverán a mostrarse aquí cuando la capa pública esté disponible.</h2>
              <p>
                Esta franja ahora solo lista programas validados desde el back office. Si el
                API público no responde o el programa no resuelve su ficha, no se mostrará en
                el carrusel.
              </p>
              <div className={styles.actionRow}>
                <Link className={styles.inlineAction} href="/admision">
                  Solicitar orientación
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className={`${styles.admissionSection} ${styles.homeSectionCompact}`}>
        <div className="shell">
          <div
            className={`${styles.sectionHeader} ${styles.homeSectionHeaderCompact}`}
            data-section-header
          >
            <p className={styles.eyebrow}>Admisión</p>
            <h2>{homeContent["admission-main"].title}</h2>
            <p>{homeContent["admission-main"].body}</p>
          </div>

          <div className={`${styles.admissionGrid} ${styles.homeGridCompact}`}>
            <ol className={styles.stepList} data-step-list>
              {admissionSteps.map((step, index) => (
                <li className={styles.homeStepCompact} key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className={`${styles.admissionPanel} ${styles.homeCardSpacious}`} data-reveal>
              <p className={styles.panelLabel}>Atención al postulante</p>
              <h3>Resolvemos tus dudas antes de iniciar la matrícula.</h3>
              <p>
                Atendemos consultas sobre programas, turnos, vacantes y requisitos en{" "}
                {institutionAddress}, {institutionDistrict}.
              </p>
              <ul className={styles.panelList}>
                <li>Orientación sobre la especialidad que te interesa.</li>
                <li>Información sobre requisitos y vacantes.</li>
                <li>Canales formales para el seguimiento de tu consulta.</li>
              </ul>
              <Link className={styles.panelAction} href="/admision">
                Solicitar orientación
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${styles.institutionSection} ${styles.homeSectionCompact}`}>
        <div className={`shell ${styles.institutionGrid} ${styles.homeGridCompact}`}>
          <div className={`${styles.institutionCopy} ${styles.homeCardSpacious}`} data-reveal>
            <p className={styles.eyebrow}>Institución</p>
            <h2>{homeContent["cta-main"].title}</h2>
            <p>{homeContent["cta-main"].body}</p>
            <div className={styles.documentStrip}>
              <span>Licenciamiento</span>
              <span>PEI</span>
              <span>Reglamento interno</span>
              <span>Planes de gestión</span>
            </div>
            <div className={styles.actionRow}>
              <Link className={styles.inlineAction} href="/gestion-institucional">
                Ver documentos oficiales
              </Link>
            </div>
          </div>

          <div className={`${styles.linkStack} ${styles.homeGridTight}`} data-link-stack>
            {managementPreview.map((document) => (
              <Link
                className={`${styles.linkCard} ${styles.homeCardCompact}`}
                href={`/gestion-institucional/${document.slug}`}
                key={document.slug}
              >
                <div className={styles.linkMeta}>
                  <span>Información oficial</span>
                  <span>→</span>
                </div>
                <strong>{document.title}</strong>
                <p>{document.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
