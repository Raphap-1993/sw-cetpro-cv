"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminApiError,
  createBlogPost,
  createContentBlock,
  createPublicDocument,
  createMediaAsset,
  createProgram,
  deleteBlogPost,
  deletePublicDocument,
  deleteMediaAsset,
  loginAdmin,
  reorderProgram,
  uploadMediaAsset,
  upsertPageSeo,
  updateContentBlock,
  updateBlogPost,
  updatePublicDocument,
  updateLeadStatus,
  updateMediaAsset,
  updateProgram
} from "@/lib/admin/api";
import { clearAdminSession, requireAdminSection, setAdminSession } from "@/lib/admin/session";
import type {
  BlogPostPayload,
  ContentPayload,
  ContentStatus,
  ContentType,
  LeadStatus,
  PageSeoPayload,
  MediaAssetPayload,
  MediaAssetStatus,
  MediaAssetType,
  PublishStatus,
  PublicDocumentPayload,
  ProgramReorderDirection,
  ProgramPayload,
  ProgramStatus
} from "@/lib/admin/types";

const programStatuses: ProgramStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const contentStatuses: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const publishStatuses: PublishStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
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

function readBoolean(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value === "string") {
    return value === "true" || value === "on" || value === "1";
  }

  return Boolean(value);
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

function revalidateBlogRoutes(slug: string, previousSlug?: string) {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath(`/blog/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

function revalidateDocumentRoutes(slug: string, previousSlug?: string) {
  revalidatePath("/documentos");
  revalidatePath("/documentos/[slug]", "page");
  revalidatePath(`/documentos/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/documentos/${previousSlug}`);
  }
}

function revalidateSeoRoutes(pageKey: string) {
  const normalized = pageKey.trim().toLowerCase();

  if (!normalized || normalized === "home") {
    revalidatePath("/");
    return;
  }

  if (normalized === "institucion") {
    revalidatePath("/institucion");
    return;
  }

  if (normalized === "admision") {
    revalidatePath("/admision");
    return;
  }

  if (normalized === "programas") {
    revalidatePath("/programas");
    return;
  }

  if (normalized === "program-detail") {
    revalidatePath("/programas/[slug]", "page");
    return;
  }

  if (normalized === "gestion-institucional") {
    revalidatePath("/gestion-institucional");
    return;
  }

  if (normalized === "libro-de-reclamaciones") {
    revalidatePath("/libro-de-reclamaciones");
    return;
  }

  if (normalized === "blog") {
    revalidatePath("/blog");
    return;
  }

  revalidatePath("/");
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

function getBlogPostPayload(formData: FormData): BlogPostPayload {
  return {
    title: requireValue(readText(formData, "title"), "El titulo es obligatorio."),
    slug: requireValue(readText(formData, "slug"), "El slug es obligatorio."),
    category: requireValue(
      readText(formData, "category"),
      "La categoria es obligatoria."
    ),
    excerpt: optionalText(formData, "excerpt"),
    body: requireValue(readText(formData, "body"), "El contenido es obligatorio."),
    coverImageUrl: optionalText(formData, "coverImageUrl"),
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    status: requireEnum(
      readText(formData, "status"),
      publishStatuses,
      "Selecciona un estado valido para la publicacion."
    ),
    publishedAt: optionalText(formData, "publishedAt")
  };
}

function getPageSeoPayload(formData: FormData): PageSeoPayload {
  const hasRobotsIndex = formData.has("robotsIndex");
  const hasRobotsFollow = formData.has("robotsFollow");

  return {
    title: requireValue(readText(formData, "title"), "El titulo es obligatorio."),
    description: requireValue(
      readText(formData, "description"),
      "La descripcion es obligatoria."
    ),
    canonicalUrl: optionalText(formData, "canonicalUrl"),
    ogImageUrl: optionalText(formData, "ogImageUrl"),
    ogTitle: optionalText(formData, "ogTitle"),
    ogDescription: optionalText(formData, "ogDescription"),
    robotsIndex: hasRobotsIndex
      ? readBoolean(formData, "robotsIndex")
      : !readBoolean(formData, "noIndex"),
    robotsFollow: hasRobotsFollow
      ? readBoolean(formData, "robotsFollow")
      : !readBoolean(formData, "noFollow")
  };
}

function getPublicDocumentPayload(formData: FormData): PublicDocumentPayload {
  const linkedPageKey =
    optionalText(formData, "linkedPageKey") ?? optionalText(formData, "pageKey");

  return {
    title: requireValue(readText(formData, "title"), "El titulo es obligatorio."),
    slug: requireValue(readText(formData, "slug"), "El slug es obligatorio."),
    category: requireValue(
      readText(formData, "category"),
      "La categoria es obligatoria."
    ),
    summary: optionalText(formData, "summary"),
    mediaAssetId: requireValue(
      readText(formData, "mediaAssetId"),
      "El documento debe vincularse a un asset de media."
    ),
    linkedPageKey: requireValue(
      linkedPageKey ?? "",
      "La pagina vinculada es obligatoria."
    ),
    linkedSectionKey: optionalText(formData, "linkedSectionKey"),
    position: optionalInteger(formData, "position", "La posicion"),
    status: requireEnum(
      readText(formData, "status"),
      publishStatuses,
      "Selecciona un estado valido para el documento."
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

export async function createBlogPostAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const payload = getBlogPostPayload(formData);

  try {
    await createBlogPost(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/blog");
  }

  revalidatePath("/admin/publico/blog");
  revalidateBlogRoutes(payload.slug);
  redirectWithMessage("/admin/publico/blog", "success", "Publicacion creada.");
}

export async function updateBlogPostAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const blogPostId = requireValue(
    readText(formData, "blogPostId"),
    "Publicacion invalida."
  );
  const previousSlug = optionalText(formData, "previousSlug");
  const payload = getBlogPostPayload(formData);

  try {
    await updateBlogPost(session.accessToken, blogPostId, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/blog");
  }

  revalidatePath("/admin/publico/blog");
  revalidateBlogRoutes(payload.slug, previousSlug);
  redirectWithMessage("/admin/publico/blog", "success", "Publicacion actualizada.");
}

export async function deleteBlogPostAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const blogPostId = requireValue(
    readText(formData, "blogPostId"),
    "Publicacion invalida."
  );
  const slug = requireValue(readText(formData, "slug"), "Slug invalido.");

  try {
    await deleteBlogPost(session.accessToken, blogPostId);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/blog");
  }

  revalidatePath("/admin/publico/blog");
  revalidateBlogRoutes(slug);
  redirectWithMessage("/admin/publico/blog", "success", "Publicacion eliminada.");
}

export async function upsertPageSeoAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const pageKey = requireValue(
    readText(formData, "pageKey"),
    "La pagina es obligatoria."
  );
  const payload = getPageSeoPayload(formData);

  try {
    await upsertPageSeo(session.accessToken, pageKey, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/seo");
  }

  revalidatePath("/admin/publico/seo");
  revalidateSeoRoutes(pageKey);
  redirectWithMessage("/admin/publico/seo", "success", "SEO actualizado.");
}

export async function createPublicDocumentAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const payload = getPublicDocumentPayload(formData);

  try {
    await createPublicDocument(session.accessToken, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/documentos");
  }

  revalidatePath("/admin/publico/documentos");
  revalidateDocumentRoutes(payload.slug);
  redirectWithMessage("/admin/publico/documentos", "success", "Documento creado.");
}

export async function updatePublicDocumentAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const documentId = requireValue(
    readText(formData, "documentId"),
    "Documento invalido."
  );
  const previousSlug = optionalText(formData, "previousSlug");
  const payload = getPublicDocumentPayload(formData);

  try {
    await updatePublicDocument(session.accessToken, documentId, payload);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/documentos");
  }

  revalidatePath("/admin/publico/documentos");
  revalidateDocumentRoutes(payload.slug, previousSlug);
  redirectWithMessage(
    "/admin/publico/documentos",
    "success",
    "Documento actualizado."
  );
}

export async function deletePublicDocumentAction(formData: FormData) {
  const session = await requireAdminSection("content");
  const documentId = requireValue(
    readText(formData, "documentId"),
    "Documento invalido."
  );
  const slug = requireValue(readText(formData, "slug"), "Slug invalido.");

  try {
    await deletePublicDocument(session.accessToken, documentId);
  } catch (error) {
    await handleAdminError(error, "/admin/publico/documentos");
  }

  revalidatePath("/admin/publico/documentos");
  revalidateDocumentRoutes(slug);
  redirectWithMessage(
    "/admin/publico/documentos",
    "success",
    "Documento eliminado."
  );
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
