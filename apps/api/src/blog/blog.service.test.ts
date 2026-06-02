import assert from "node:assert/strict";
import test from "node:test";
import { NotFoundException } from "@nestjs/common";
import { BlogService } from "./blog.service";

test("blog service publishes a timestamp when creating a published post", async () => {
  let capturedPublishedAt: Date | undefined;
  let capturedCategory: string | undefined;
  const prisma = {
    blogPost: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        capturedPublishedAt = data.publishedAt as Date | undefined;
        capturedCategory = data.category as string | undefined;
        return { id: "blog-1", ...data };
      }
    }
  } as any;

  const service = new BlogService(prisma);
  const result = await service.create({
    title: "Hola",
    slug: "hola",
    category: "Noticias",
    body: "Contenido",
    status: "PUBLISHED"
  });

  assert.equal(result.id, "blog-1");
  assert.equal(capturedCategory, "Noticias");
  assert.ok(capturedPublishedAt instanceof Date);
});

test("blog service searches admin posts by category text", async () => {
  let capturedArgs: { where?: { OR?: Array<Record<string, unknown>> } } | null =
    null;
  const prisma = {
    blogPost: {
      findMany: async (args: {
        where?: { OR?: Array<Record<string, unknown>> };
      }) => {
        capturedArgs = args;
        return [];
      }
    }
  } as any;

  const service = new BlogService(prisma);
  await service.findAll({ q: "Noticias" });

  if (!capturedArgs) {
    throw new Error("Expected findMany to capture admin query args.");
  }

  const resolvedArgs = capturedArgs as {
    where?: { OR?: Array<Record<string, unknown>> };
  };

  assert.ok(
    resolvedArgs.where?.OR?.some((entry: Record<string, unknown>) =>
        "category" in entry &&
        entry.category &&
        typeof entry.category === "object" &&
        "contains" in entry.category
    )
  );
});

test("blog service rejects missing published posts by slug", async () => {
  const prisma = {
    blogPost: {
      findFirst: async () => null
    }
  } as any;

  const service = new BlogService(prisma);

  await assert.rejects(
    () => service.findPublishedBySlug("missing"),
    (error) => error instanceof NotFoundException
  );
});
