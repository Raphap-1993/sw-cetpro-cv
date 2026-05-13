"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminApiError,
  createContentBlock,
  createMediaAsset,
  createProgram,
  deleteMediaAsset,
  loginAdmin,
  reorderProgram,
  uploadMediaAsset,
  updateContentBlock,
  updateLeadStatus,
  updateMediaAsset,
  updateProgram
} from "@/lib/admin/api";
import { clearAdminSession, requireAdminSection, setAdminSession } from "@/lib/admin/session";
import type {
  ContentPayload,
  ContentStatus,
  ContentType,
  LeadStatus,
  MediaAssetPayload,
  MediaAssetStatus,
  MediaAssetType,
  ProgramReorderDirection,
  ProgramPayload,
  ProgramStatus
} from "@/lib/admin/types";

const programStatuses: ProgramStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const contentStatuses: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const mediaStatuses: MediaAssetStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const leadStatuses: LeadStatus[] = ["NEW", "CONTACTED", "CLOSED", "DISCARDED"];
const contentTypes: ContentType[] = [
  "HERO",
  "SECTION",
  "CTA",
  "TEXT",
  "IMAGE",
  "FAQ"
];
const mediaTypes: MediaAssetType[] = ["IMAGE", "DOCUMENT", "VIDEO", "OTHER"];
const programReorderDirections: ProgramReorderDirection[] = ["up", "down"];

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = readText(formData, key);
  return value || undefined;
}

function optionalInteger(
  formData: FormData,
  key: string,
  fieldName: string
) {
  const value = readText(formData, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} debe ser numerica.`);
  }

  if (parsed < 0) {
    throw new Error(`${fieldName} debe ser mayor o igual a 0.`);
  }

  return parsed;
}

function requireValue(value: string, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

function requireEnum<T extends string>(
  value: string,
  options: readonly T[],
  message: string
) {
  if (!options.includes(value as T)) {
    throw new Error(message);
  }

  return value as T;
}

function redirectWithMessage(
  path: string,
  kind: "error" | "success",
  message: string
): never {
  redirect(`${path}?${kind}=${encodeURIComponent(message)}`);
}

function getPublicPathForPage(page: string) {
  const normalized = page.trim().toLowerCase();

  if (!normalized || normalized === "home") {
    return "/";
  }

  if (normalized === "programs") {
    return "/programas";
  }

  return `/${normalized}`;
}

function revalidateContentPage(page: string) {
  const normalized = page.trim().toLowerCase();

  if (normalized === "program-detail") {
    revalidatePath("/programas/[slug]", "page");
    return;
  }

  if (normalized === "site") {
    revalidatePath("/");
    revalidatePath("/institucion");
    revalidatePath("/admision");
    revalidatePath("/programas");
    revalidatePath("/programas/[slug]", "page");
    revalidatePath("/gestion-institucional");
    revalidatePath("/libro-de-reclamaciones");
    return;
  }

  revalidatePath(getPublicPathForPage(page));
}

function revalidateProgramRoutes(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/programas");
  revalidatePath("/programas/[slug]", "page");
  revalidatePath(`/programas/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/programas/${previousSlug}`);
  }
}

function revalidateContentRoutes(page: string, previousPage?: string) {
  revalidateContentPage(page);

  if (previousPage && previousPage !== page) {
    revalidateContentPage(previousPage);
  }
}

function revalidateMediaRoutes() {
  revalidatePath("/admin/media");
  revalidatePath("/admin/programas");
  revalidatePath("/admin/contenido");
}

async function handleAdminError(error: unknown, path: string): Promise<never> {
  if (error instanceof AdminApiError) {
    if (error.status === 401) {
      await clearAdminSession();
      redirectWithMessage("/admin/login", "error", "Tu sesion vencio.");
    }

    redirectWithMessage(path, "error", error.message);
  }

  if (error instanceof Error) {
    redirectWithMessage(path, "error", error.message);
  }

  redirectWithMessage(path, "error", "No se pudo completar la operacion.");
}

function getProgramPayload(formData: FormData): ProgramPayload {
  return {
    title: requireValue(readText(formData, "title"), "El titulo es obligatorio."),
    slug: requireValue(readText(formData, "slug"), "El slug es obligatorio."),
    summary: optionalText(formData, "summary"),
    description: optionalText(formData, "description"),
    studyPlan: optionalText(formData, "studyPlan"),
    duration: optionalText(formData, "duration"),
    modality: optionalText(formData, "modality"),
    imageUrl: optionalText(formData, "imageUrl"),
    position: optionalInteger(formData, "position", "La posicion"),
    status: requireEnum(
      readText(formData, "status"),
      programStatuses,
      "Selecciona un estado valido para el programa."
    )
  };
}

function getContentPayload(formData: FormData): ContentPayload {
  return {
    page: requireValue(readText(formData, "page"), "La pagina es obligatoria."),
    key: requireValue(readText(formData, "key"), "La clave es obligatoria."),
    type: requireEnum(
      readText(formData, "type"),
      contentTypes,
      "Selecciona un tipo valido para el bloque."
    ),
    title: optionalText(formData, "title"),
    body: optionalText(formData, "body"),
    mediaUrl: optionalText(formData, "mediaUrl"),
    position: optionalInteger(formData, "position", "La posicion"),
    status: requireEnum(
      readText(formData, "status"),
      contentStatuses,
      "Selecciona un estado valido para el bloque."
    )
  };
}

function getMediaPayload(formData: FormData): MediaAssetPayload {
  return {
    title: requireValue(readText(formData, "title"), "El titulo es obligatorio."),
    altText: optionalText(formData, "altText"),
    url: requireValue(readText(formData, "url"), "La URL es obligatoria."),
    type: requireEnum(
      readText(formData, "type"),
      mediaTypes,
      "Selecciona un tipo valido para el asset."
    ),
    status: requireEnum(
      readText(formData, "status"),
      mediaStatuses,
      "Selecciona un estado valido para el asset."
    )
  };
}

export async function loginAction(formData: FormData) {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!email || !password) {
    redirectWithMessage(
      "/admin/login",
      "error",
      "Completa correo y contrasena."
    );
  }

  try {
    const login = await loginAdmin(email, password);
    await setAdminSession(login);
  } catch (error) {
    await clearAdminSession();
    await handleAdminError(error, "/admin/login");
  }

  redirect("/admin");
}

export async function updateLeadStatusAction(formData: FormData) {
  const session = await requireAdminSection("leads");
  const leadId = requireValue(readText(formData, "leadId"), "Lead invalido.");

  try {
    await updateLeadStatus(
      session.accessToken,
      leadId,
      requireEnum(
        readText(formData, "status"),
        leadStatuses,
        "Selecciona un estado valido."
      )
    );
  } catch (error) {
    await handleAdminError(error, "/admin/leads");
  }

  revalidatePath("/admin/leads");
  redirectWithMessage("/admin/leads", "success", "Estado actualizado.");
}

export async function createProgramAction(formData: FormData) {
  const session = await requireAdminSection("programs");
  const payload = getProgramPayload(formData);

  try {
    await createProgram(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/programas");
  }

  revalidatePath("/admin/programas");
  revalidateProgramRoutes(payload.slug);
  redirectWithMessage("/admin/programas", "success", "Programa creado.");
}

export async function updateProgramAction(formData: FormData) {
  const session = await requireAdminSection("programs");
  const programId = requireValue(
    readText(formData, "programId"),
    "Programa invalido."
  );
  const previousSlug = optionalText(formData, "previousSlug");
  const payload = getProgramPayload(formData);

  try {
    await updateProgram(session.accessToken, programId, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/programas");
  }

  revalidatePath("/admin/programas");
  revalidateProgramRoutes(payload.slug, previousSlug);
  redirectWithMessage("/admin/programas", "success", "Programa actualizado.");
}

export async function reorderProgramAction(formData: FormData) {
  const session = await requireAdminSection("programs");
  const programId = requireValue(
    readText(formData, "programId"),
    "Programa invalido."
  );
  const slug = requireValue(readText(formData, "slug"), "Slug invalido.");
  const direction = requireEnum(
    readText(formData, "direction"),
    programReorderDirections,
    "Direccion invalida."
  );

  try {
    await reorderProgram(session.accessToken, programId, direction);
  } catch (error) {
    await handleAdminError(error, "/admin/programas");
  }

  revalidatePath("/admin/programas");
  revalidateProgramRoutes(slug);
  redirectWithMessage("/admin/programas", "success", "Orden actualizado.");
}

export async function createContentAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const payload = getContentPayload(formData);

  try {
    await createContentBlock(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/contenido");
  }

  revalidatePath("/admin/contenido");
  revalidateContentRoutes(payload.page);
  redirectWithMessage("/admin/contenido", "success", "Bloque creado.");
}

export async function updateContentAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const blockId = requireValue(
    readText(formData, "blockId"),
    "Bloque invalido."
  );
  const previousPage = optionalText(formData, "previousPage");
  const payload = getContentPayload(formData);

  try {
    await updateContentBlock(session.accessToken, blockId, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/contenido");
  }

  revalidatePath("/admin/contenido");
  revalidateContentRoutes(payload.page, previousPage);
  redirectWithMessage("/admin/contenido", "success", "Bloque actualizado.");
}

export async function createMediaAction(formData: FormData) {
  const session = await requireAdminSection("media");
  const payload = getMediaPayload(formData);

  try {
    await createMediaAsset(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/media");
  }

  revalidateMediaRoutes();
  redirectWithMessage("/admin/media", "success", "Asset creado.");
}

export async function uploadMediaAction(formData: FormData) {
  const session = await requireAdminSection("media");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size <= 0) {
    redirectWithMessage(
      "/admin/media",
      "error",
      "Selecciona un archivo para subir."
    );
  }

  const payload = new FormData();
  payload.set("file", file);

  const title = optionalText(formData, "title");
  const altText = optionalText(formData, "altText");
  const type = optionalText(formData, "type");
  const status = optionalText(formData, "status");

  if (title) {
    payload.set("title", title);
  }

  if (altText) {
    payload.set("altText", altText);
  }

  if (type) {
    payload.set(
      "type",
      requireEnum(type, mediaTypes, "Selecciona un tipo valido para el asset.")
    );
  }

  if (status) {
    payload.set(
      "status",
      requireEnum(
        status,
        mediaStatuses,
        "Selecciona un estado valido para el asset."
      )
    );
  }

  try {
    await uploadMediaAsset(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/media");
  }

  revalidateMediaRoutes();
  redirectWithMessage("/admin/media", "success", "Archivo subido.");
}

export async function updateMediaAction(formData: FormData) {
  const session = await requireAdminSection("media");
  const assetId = requireValue(readText(formData, "assetId"), "Asset invalido.");
  const payload = getMediaPayload(formData);

  try {
    await updateMediaAsset(session.accessToken, assetId, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/media");
  }

  revalidateMediaRoutes();
  redirectWithMessage("/admin/media", "success", "Asset actualizado.");
}

export async function deleteMediaAction(formData: FormData) {
  const session = await requireAdminSection("media");
  const assetId = requireValue(readText(formData, "assetId"), "Asset invalido.");

  try {
    await deleteMediaAsset(session.accessToken, assetId);
  } catch (error) {
    await handleAdminError(error, "/admin/media");
  }

  revalidateMediaRoutes();
  redirectWithMessage("/admin/media", "success", "Asset eliminado.");
}
