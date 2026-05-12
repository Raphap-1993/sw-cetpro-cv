import { PrismaClient } from "@prisma/client";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildLocalMediaUrl,
  ensureMediaUploadDir,
  guessMediaTypeFromMimeType,
  writeUploadedMediaFile
} from "../../src/media/media-storage";

const prisma = new PrismaClient();

type LegacyAssetReference = {
  url: string;
  titles: string[];
};

const defaultLegacyPattern = "/wp-content/uploads/";

function getLegacyPattern() {
  return process.env.LEGACY_MEDIA_MATCH?.trim() || defaultLegacyPattern;
}

function getLegacySourceDir() {
  const configuredDir = process.env.LEGACY_MEDIA_SOURCE_DIR?.trim();

  return configuredDir ? path.resolve(configuredDir) : null;
}

function matchesLegacyUrl(value: string | null | undefined): value is string {
  return typeof value === "string" && value.includes(getLegacyPattern());
}

function inferExtensionFromMimeType(mimeType: string | undefined) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    case "application/pdf":
      return ".pdf";
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    default:
      return "";
  }
}

function inferMimeTypeFromFilename(filename: string) {
  switch (path.extname(filename).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

function inferOriginalName(url: string, mimeType: string | undefined) {
  const parsedUrl = new URL(url);
  const basename = path.basename(parsedUrl.pathname);
  const decodedName = decodeURIComponent(basename);

  if (path.extname(decodedName)) {
    return decodedName;
  }

  return `${decodedName || "legacy-asset"}${inferExtensionFromMimeType(mimeType)}`;
}

function buildLegacySourcePath(url: string) {
  const sourceDir = getLegacySourceDir();

  if (!sourceDir) {
    return null;
  }

  const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, "");
  return path.resolve(sourceDir, pathname);
}

async function readLocalLegacyAsset(url: string) {
  const sourcePath = buildLegacySourcePath(url);

  if (!sourcePath) {
    return null;
  }

  try {
    await access(sourcePath);
  } catch {
    return null;
  }

  const buffer = await readFile(sourcePath);
  const originalname = path.basename(sourcePath);

  return {
    buffer,
    mimetype: inferMimeTypeFromFilename(originalname),
    originalname,
    size: buffer.byteLength
  };
}

async function downloadLegacyAsset(url: string) {
  const localAsset = await readLocalLegacyAsset(url);

  if (localAsset) {
    return localAsset;
  }

  const response = await fetch(url, {
    headers: {
      "user-agent": "sw-cetpro-cv-media-migrator/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim();
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    buffer,
    mimetype: mimeType || "application/octet-stream",
    originalname: inferOriginalName(url, mimeType),
    size: buffer.byteLength
  };
}

async function collectLegacyReferences() {
  const [programs, contentBlocks, mediaAssets] = await Promise.all([
    prisma.program.findMany({
      where: {
        imageUrl: {
          contains: getLegacyPattern()
        }
      },
      select: {
        title: true,
        imageUrl: true
      }
    }),
    prisma.contentBlock.findMany({
      where: {
        mediaUrl: {
          contains: getLegacyPattern()
        }
      },
      select: {
        title: true,
        page: true,
        key: true,
        mediaUrl: true
      }
    }),
    prisma.mediaAsset.findMany({
      where: {
        url: {
          contains: getLegacyPattern()
        }
      },
      select: {
        title: true,
        url: true
      }
    })
  ]);

  const references = new Map<string, LegacyAssetReference>();

  const register = (url: string | null | undefined, title: string) => {
    if (!matchesLegacyUrl(url)) {
      return;
    }

    const existing: LegacyAssetReference = references.get(url) ?? {
      url,
      titles: []
    };

    if (!existing.titles.includes(title)) {
      existing.titles.push(title);
    }

    references.set(url, existing);
  };

  for (const program of programs) {
    register(program.imageUrl, `Programa ${program.title}`);
  }

  for (const block of contentBlocks) {
    register(
      block.mediaUrl,
      block.title || `Contenido ${block.page}/${block.key}`
    );
  }

  for (const asset of mediaAssets) {
    register(asset.url, asset.title);
  }

  return Array.from(references.values());
}

async function migrateReference(reference: LegacyAssetReference) {
  const existingMediaAsset = await prisma.mediaAsset.findUnique({
    where: { url: reference.url }
  });
  const upload = await downloadLegacyAsset(reference.url);
  const { storageKey } = await writeUploadedMediaFile(upload);
  const localUrl = buildLocalMediaUrl(storageKey);
  const mediaType = guessMediaTypeFromMimeType(upload.mimetype);

  await prisma.$transaction(async (tx) => {
    await tx.program.updateMany({
      where: { imageUrl: reference.url },
      data: { imageUrl: localUrl }
    });

    await tx.contentBlock.updateMany({
      where: { mediaUrl: reference.url },
      data: { mediaUrl: localUrl }
    });

    if (existingMediaAsset) {
      await tx.mediaAsset.update({
        where: { id: existingMediaAsset.id },
        data: {
          url: localUrl,
          source: "LOCAL_UPLOAD",
          storageKey,
          type: mediaType,
          status: existingMediaAsset.status
        }
      });
      return;
    }

    await tx.mediaAsset.create({
      data: {
        title: reference.titles[0] || "Media migrada",
        altText: reference.titles[0] || "Media migrada",
        url: localUrl,
        source: "LOCAL_UPLOAD",
        storageKey,
        type: mediaType,
        status: "PUBLISHED"
      }
    });
  });

  console.log(`${reference.url} -> ${localUrl}`);
}

async function main() {
  await ensureMediaUploadDir();

  const references = await collectLegacyReferences();

  if (references.length === 0) {
    console.log("No legacy public media references found.");
    return;
  }

  for (const reference of references) {
    await migrateReference(reference);
  }

  console.log(`Migrated ${references.length} legacy public assets.`);
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "migrate-legacy-public-media-failed"
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
