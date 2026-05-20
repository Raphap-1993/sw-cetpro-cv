import "server-only";
import {
  getPublishedProgram,
  listPublishedPrograms as listPrograms,
  type PublicProgramDetail
} from "@/lib/public-data";

export type PublicProgram = PublicProgramDetail;

export function getProgramPath(slug: string) {
  return `/programas/${slug}`;
}

const programIllustrations = [
  {
    match: ["apoyo-administrativo"],
    url: "/brand/program-apoyo-administrativo.svg"
  },
  {
    match: ["estilismo", "cosmetologia"],
    url: "/brand/program-estilismo.svg"
  },
  {
    match: ["patronaje"],
    url: "/brand/program-patronaje.svg"
  },
  {
    match: ["panificacion"],
    url: "/brand/program-panificacion-industrial.svg"
  },
  {
    match: ["almacenamiento", "almacen"],
    url: "/brand/program-control-almacenamiento.svg"
  },
  {
    match: ["programacion", "sistemas-de-informacion"],
    url: "/brand/program-programacion-sistemas.svg"
  },
  {
    match: ["electronicos", "electronico"],
    url: "/brand/program-mantenimiento-electronico.svg"
  }
] as const;

export function getProgramIllustrationUrl(
  slug: string,
  title?: string | null,
  imageUrl?: string | null
) {
  const providedImageUrl = imageUrl?.trim();

  if (providedImageUrl) {
    return providedImageUrl;
  }

  const normalized = [slug, title ?? ""]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const match = programIllustrations.find((item) =>
    item.match.some((fragment) => normalized.includes(fragment))
  );

  return match?.url ?? "/brand/program-programacion-sistemas.svg";
}

export function getProgramCopy(program: PublicProgram) {
  return (
    program.summary ??
    program.description ??
    "Programa técnico disponible para consulta pública."
  );
}

export function getProgramCode(title: string) {
  const normalized = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const stopWords = new Set([
    "DE",
    "DEL",
    "LA",
    "EL",
    "Y",
    "EN",
    "PARA",
    "LOS",
    "LAS"
  ]);

  const words = normalized
    .split(/[^A-Z0-9]+/)
    .filter((word) => word.length > 0 && !stopWords.has(word));

  if (words.length === 0) {
    return "CV";
  }

  if (words.length >= 3) {
    return words
      .slice(0, 3)
      .map((word) => word[0])
      .join("");
  }

  const compact = words.join("");
  return compact.slice(0, 3).padEnd(3, compact[0] ?? "C");
}

export function getProgramParagraphs(text: string | null) {
  if (!text) {
    return [];
  }

  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function getStudyPlanItems(studyPlan: string | null) {
  if (!studyPlan) {
    return [];
  }

  const normalized = studyPlan.replace(/\r/g, "").trim();

  if (!normalized) {
    return [];
  }

  const primaryItems = normalized
    .split(/\s*[;\n•]+\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (primaryItems.length > 1) {
    return primaryItems;
  }

  const commaItems = normalized
    .split(/\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return commaItems.length > 1 ? commaItems : [normalized];
}

export async function listPublishedPrograms(): Promise<PublicProgram[]> {
  const programs = await listPrograms();

  return programs.map((program) => ({
    ...program,
    description: program.description ?? null,
    studyPlan: program.studyPlan ?? null
  }));
}

export async function getPublishedProgramBySlug(slug: string) {
  const program = await getPublishedProgram(slug);

  if (!program) {
    return null;
  }

  return {
    ...program,
    description: program.description ?? null,
    studyPlan: program.studyPlan ?? null
  };
}
