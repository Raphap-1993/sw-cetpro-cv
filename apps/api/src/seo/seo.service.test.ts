import assert from "node:assert/strict";
import test from "node:test";
import { SeoService } from "./seo.service";

test("seo service upserts page metadata by page key", async () => {
  let upsertArgs: unknown = null;
  const prisma = {
    pageSeo: {
      upsert: async (args: unknown) => {
        upsertArgs = args;
        return { id: "seo-1", ...((args as { create: object }).create as object) };
      }
    }
  } as any;

  const service = new SeoService(prisma);
  const result = await service.upsert("home", {
    title: "Home",
    description: "Descripcion",
    canonicalUrl: "https://example.com/",
    ogImageUrl: "https://example.com/og.jpg",
    ogTitle: "Home OG",
    ogDescription: "Descripcion OG",
    robotsIndex: true,
    robotsFollow: false
  });

  assert.equal(result.id, "seo-1");
  assert.deepEqual((upsertArgs as { where: { pageKey: string } }).where, {
    pageKey: "home"
  });
  assert.equal(
    ((upsertArgs as { create: { ogTitle: string } }).create.ogTitle),
    "Home OG"
  );
  assert.equal(
    ((upsertArgs as { create: { robotsFollow: boolean } }).create.robotsFollow),
    false
  );
});

test("seo service returns a public record by page key", async () => {
  let findUniqueArgs: unknown = null;
  const prisma = {
    pageSeo: {
      findUnique: async (args: unknown) => {
        findUniqueArgs = args;
        return {
          pageKey: "home"
        };
      }
    }
  } as any;

  const service = new SeoService(prisma);
  const result = await service.findPublicByPageKey("home");

  assert.equal(result?.pageKey, "home");
  assert.deepEqual((findUniqueArgs as { where: { pageKey: string } }).where, {
    pageKey: "home"
  });
});
