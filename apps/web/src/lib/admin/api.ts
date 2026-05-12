import "server-only";

import type {
  ContentBlock,
  ContentPayload,
  Lead,
  LeadStatus,
  LoginResponse,
  MediaAsset,
  MediaAssetPayload,
  Program,
  ProgramReorderDirection,
  ProgramPayload
} from "./types";

const apiUrl =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4010/api";

function buildApiUrl(path: string) {
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const message = "message" in body ? body.message : null;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string" ? message : fallback;
}

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

async function requestJson<T>(
  path: string,
  init: RequestInit & {
    accessToken?: string;
    fallbackMessage: string;
  }
) {
  const { accessToken, fallbackMessage, headers, ...requestInit } = init;

  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...requestInit,
      cache: "no-store",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
        ...headers
      }
    });
  } catch {
    throw new AdminApiError("No se pudo conectar con el API.", 502);
  }

  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new AdminApiError(
      getErrorMessage(body, fallbackMessage),
      response.status
    );
  }

  return body as T;
}

export async function loginAdmin(email: string, password: string) {
  return requestJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    fallbackMessage: "No se pudo iniciar sesion."
  });
}

export async function listAdminLeads(accessToken: string) {
  return requestJson<Lead[]>("/leads", {
    method: "GET",
    accessToken,
    fallbackMessage: "No se pudo cargar la bandeja de leads."
  });
}

export async function updateLeadStatus(
  accessToken: string,
  leadId: string,
  status: LeadStatus
) {
  return requestJson<Lead>(`/leads/${leadId}/status`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify({ status }),
    fallbackMessage: "No se pudo actualizar el estado del lead."
  });
}

export async function listAdminPrograms(accessToken: string) {
  return requestJson<Program[]>("/programs/admin", {
    method: "GET",
    accessToken,
    fallbackMessage: "No se pudo cargar el catalogo administrativo."
  });
}

export async function createProgram(
  accessToken: string,
  payload: ProgramPayload
) {
  return requestJson<Program>("/programs", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo crear el programa."
  });
}

export async function updateProgram(
  accessToken: string,
  programId: string,
  payload: ProgramPayload
) {
  return requestJson<Program>(`/programs/${programId}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo actualizar el programa."
  });
}

export async function reorderProgram(
  accessToken: string,
  programId: string,
  direction: ProgramReorderDirection
) {
  return requestJson<Program>(`/programs/${programId}/reorder`, {
    method: "POST",
    accessToken,
    body: JSON.stringify({ direction }),
    fallbackMessage: "No se pudo reordenar el programa."
  });
}

export async function listAdminContent(accessToken: string, page?: string) {
  const query = page ? `?page=${encodeURIComponent(page)}` : "";

  return requestJson<ContentBlock[]>(`/content${query}`, {
    method: "GET",
    accessToken,
    fallbackMessage: "No se pudo cargar el contenido administrativo."
  });
}

export async function createContentBlock(
  accessToken: string,
  payload: ContentPayload
) {
  return requestJson<ContentBlock>("/content", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo crear el bloque de contenido."
  });
}

export async function updateContentBlock(
  accessToken: string,
  blockId: string,
  payload: ContentPayload
) {
  return requestJson<ContentBlock>(`/content/${blockId}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo actualizar el bloque de contenido."
  });
}

export async function listAdminMedia(accessToken: string) {
  try {
    return await requestJson<MediaAsset[]>("/media", {
      method: "GET",
      accessToken,
      fallbackMessage: "No se pudo cargar la biblioteca de media."
    });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function createMediaAsset(
  accessToken: string,
  payload: MediaAssetPayload
) {
  return requestJson<MediaAsset>("/media", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo crear el asset de media."
  });
}

export async function uploadMediaAsset(accessToken: string, payload: FormData) {
  let response: Response;

  try {
    response = await fetch(buildApiUrl("/media/upload"), {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: payload
    });
  } catch {
    throw new AdminApiError("No se pudo conectar con el API.", 502);
  }

  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new AdminApiError(
      getErrorMessage(body, "No se pudo subir el archivo."),
      response.status
    );
  }

  return body as MediaAsset;
}

export async function updateMediaAsset(
  accessToken: string,
  assetId: string,
  payload: MediaAssetPayload
) {
  return requestJson<MediaAsset>(`/media/${assetId}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
    fallbackMessage: "No se pudo actualizar el asset de media."
  });
}

export async function deleteMediaAsset(accessToken: string, assetId: string) {
  return requestJson<MediaAsset>(`/media/${assetId}`, {
    method: "DELETE",
    accessToken,
    fallbackMessage: "No se pudo eliminar el asset de media."
  });
}
