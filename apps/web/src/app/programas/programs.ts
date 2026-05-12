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

export function getProgramCopy(program: PublicProgram) {
  return (
    program.summary ??
    program.description ??
    "Programa técnico disponible para consulta pública."
  );
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
