import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultMediaUploadDir = "var/uploads/media";
const defaultAllowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/quicktime"
] as const;

export type UploadedMediaFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getAppRoot() {
  return process.env.APP_ROOT?.trim() || process.cwd();
}

function parsePositiveNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function toAscii(value: string) {
  return Array.from(value)
    .filter((character) => character.charCodeAt(0) <= 0x7f)
    .join("");
}

export function getMediaUploadDir() {
  const configuredDir = process.env.MEDIA_UPLOAD_DIR?.trim() || defaultMediaUploadDir;

  return path.isAbsolute(configuredDir)
    ? configuredDir
    : path.resolve(getAppRoot(), configuredDir);
}

export async function ensureMediaUploadDir() {
  await mkdir(getMediaUploadDir(), { recursive: true });
}

export function getMediaStorageDriver() {
  return process.env.MEDIA_STORAGE_DRIVER?.trim().toLowerCase() || "local";
}

export function getMediaPublicBaseUrl() {
  const configuredBaseUrl = process.env.MEDIA_PUBLIC_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  const port = Number(process.env.API_PORT ?? 4010);
  return `http://localhost:${port}/media`;
}

export function buildLocalMediaUrl(storageKey: string) {
  return `${getMediaPublicBaseUrl()}/${storageKey}`;
}

export function buildLocalMediaPath(storageKey: string) {
  return path.join(getMediaUploadDir(), storageKey);
}

export function sanitizeUploadFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase().slice(0, 12);
  const stem = path
    .basename(filename, path.extname(filename))
    .normalize("NFKD");
  const sanitizedStem = toAscii(stem)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${Date.now()}-${randomUUID()}-${sanitizedStem || "asset"}${extension}`;
}

function buildStorageKey(filename: string) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return path.posix.join(year, month, sanitizeUploadFilename(filename));
}

export function guessMediaTypeFromMimeType(
  mimeType: string | undefined
): "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER" {
  if (!mimeType) {
    return "OTHER";
  }

  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  if (mimeType === "application/pdf") {
    return "DOCUMENT";
  }

  return "OTHER";
}

export function getAllowedUploadMimeTypes() {
  const configuredMimeTypes = process.env.MEDIA_ALLOWED_MIME_TYPES?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return configuredMimeTypes?.length
    ? configuredMimeTypes
    : [...defaultAllowedMimeTypes];
}

export function isSupportedUploadMimeType(mimeType: string | undefined) {
  if (!mimeType) {
    return false;
  }

  return getAllowedUploadMimeTypes().includes(mimeType.toLowerCase());
}

export function getMediaMaxUploadSizeBytes() {
  return parsePositiveNumber(process.env.MEDIA_MAX_FILE_SIZE_MB, 25) * 1024 * 1024;
}

export function shouldDeleteManagedMediaFiles() {
  return parseBoolean(process.env.MEDIA_DELETE_MANAGED_FILES, true);
}

export async function writeUploadedMediaFile(file: UploadedMediaFile) {
  const storageKey = buildStorageKey(file.originalname);
  const absolutePath = buildLocalMediaPath(storageKey);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, file.buffer);

  return {
    storageKey,
    absolutePath
  };
}

export async function deleteUploadedMediaFile(storageKey: string) {
  try {
    await unlink(buildLocalMediaPath(storageKey));
    return true;
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;

    if (fileError.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

export async function getMediaStorageHealth() {
  const uploadDir = getMediaUploadDir();

  try {
    await mkdir(uploadDir, { recursive: true });
    await access(uploadDir, constants.R_OK | constants.W_OK);

    return {
      ok: true,
      driver: getMediaStorageDriver(),
      uploadDir,
      publicBaseUrl: getMediaPublicBaseUrl()
    };
  } catch (error) {
    return {
      ok: false,
      driver: getMediaStorageDriver(),
      uploadDir,
      publicBaseUrl: getMediaPublicBaseUrl(),
      error: error instanceof Error ? error.message : "media-storage-check-failed"
    };
  }
}
