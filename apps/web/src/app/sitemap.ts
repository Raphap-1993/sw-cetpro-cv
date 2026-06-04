import type { MetadataRoute } from "next";
import { managementDocuments } from "@/app/public-site";
import { listPublishedPrograms } from "@/app/programas/programs";

function getPrimaryWebOrigin() {
  return process.env.WEB_ORIGIN?.split(",")[0]?.trim() ?? "http://localhost:3010";
}

function getAbsoluteUrl(path: string) {
  return new URL(path, getPrimaryWebOrigin()).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await listPublishedPrograms();

  return [
    { url: getAbsoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: getAbsoluteUrl("/institucion"),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: getAbsoluteUrl("/programas"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: getAbsoluteUrl("/admision"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: getAbsoluteUrl("/contacto"),
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...programs.map((program) => ({
      url: getAbsoluteUrl(`/programas/${program.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...managementDocuments.map((document) => ({
      url: getAbsoluteUrl(`/gestion-institucional/${document.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
