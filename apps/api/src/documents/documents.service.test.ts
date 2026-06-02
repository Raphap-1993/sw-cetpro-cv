import assert from "node:assert/strict";
import test from "node:test";
import { NotFoundException } from "@nestjs/common";
import { DocumentsService } from "./documents.service";

test("documents service creates documents with linked media and page references", async () => {
  let createArgs:
    | {
        data: {
          linkedPageKey: string;
          linkedSectionKey?: string;
          mediaAssetId: string;
        };
      }
    | null = null;
  const prisma = {
    mediaAsset: {
      findUnique: async () => ({ id: "media-1", url: "https://example.com/doc.pdf" })
    },
    publicDocument: {
      create: async (args: {
        data: {
          linkedPageKey: string;
          linkedSectionKey?: string;
          mediaAssetId: string;
        };
      }) => {
        createArgs = args;
        return {
          id: "doc-1",
          slug: "guideline",
          title: "Guideline",
          category: "General",
          summary: null,
          linkedPageKey: args.data.linkedPageKey,
          linkedSectionKey: args.data.linkedSectionKey ?? null,
          mediaAssetId: args.data.mediaAssetId,
          mediaAsset: {
            id: "media-1",
            title: "Reglamento",
            url: "https://example.com/doc.pdf",
            type: "DOCUMENT"
          },
          position: 0,
          status: "PUBLISHED"
        };
      }
    }
  } as any;

  const service = new DocumentsService(prisma);
  const document = await service.create({
    title: "Guideline",
    slug: "guideline",
    category: "General",
    linkedPageKey: "gestion-institucional",
    linkedSectionKey: "normativa",
    mediaAssetId: "media-1",
    status: "PUBLISHED"
  });

  assert.equal(document.mediaAssetId, "media-1");
  assert.equal(document.url, "https://example.com/doc.pdf");
  if (!createArgs) {
    throw new Error("Expected create args to be captured.");
  }

  const resolvedCreateArgs = createArgs as {
    data: Record<string, unknown>;
  };

  assert.deepEqual(resolvedCreateArgs.data, {
    title: "Guideline",
    slug: "guideline",
    category: "General",
    linkedPageKey: "gestion-institucional",
    linkedSectionKey: "normativa",
    mediaAssetId: "media-1",
    status: "PUBLISHED"
  });
});

test("documents service returns published documents by slug", async () => {
  let findFirstArgs: Record<string, unknown> | null = null;
  const prisma = {
    mediaAsset: {
      findUnique: async () => ({ id: "media-1", url: "https://example.com/doc.pdf" })
    },
    publicDocument: {
      findFirst: async ({
        where,
        include
      }: {
        where: Record<string, unknown>;
        include?: Record<string, unknown>;
      }) => {
        findFirstArgs = { where, include };
        if (where.slug === "guideline") {
          return {
            id: "doc-1",
            slug: "guideline",
            title: "Guideline",
            category: "General",
            summary: null,
            linkedPageKey: "gestion-institucional",
            linkedSectionKey: "normativa",
            mediaAssetId: "media-1",
            mediaAsset: {
              id: "media-1",
              title: "Guideline PDF",
              url: "https://example.com/doc.pdf",
              type: "DOCUMENT"
            },
            position: 0,
            status: "PUBLISHED"
          };
        }

        return null;
      }
    }
  } as any;

  const service = new DocumentsService(prisma);
  const document = await service.findPublishedBySlug("guideline");

  assert.equal(document.slug, "guideline");
  assert.equal(document.url, "https://example.com/doc.pdf");
  if (!findFirstArgs) {
    throw new Error("Expected findFirst args to be captured.");
  }

  const resolvedFindFirstArgs = findFirstArgs as {
    include?: Record<string, unknown>;
  };

  assert.deepEqual(resolvedFindFirstArgs.include, {
    mediaAsset: true
  });
});

test("documents service rejects missing published documents", async () => {
  const prisma = {
    publicDocument: {
      findFirst: async () => null
    }
  } as any;

  const service = new DocumentsService(prisma);

  await assert.rejects(
    () => service.findPublishedBySlug("missing"),
    (error) => error instanceof NotFoundException
  );
});
