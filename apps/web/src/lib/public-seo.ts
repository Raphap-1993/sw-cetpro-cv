import "server-only";

import type { Metadata } from "next";
import { getPublicPageSeo } from "./public-data";

type BuildPageMetadataInput = {
  pageKey: string;
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
};

export async function buildPageMetadata(
  input: BuildPageMetadataInput
): Promise<Metadata> {
  const seo = await getPublicPageSeo(input.pageKey);
  const title = seo?.title ?? input.title;
  const description = seo?.description ?? input.description;
  const canonicalUrl = seo?.canonicalUrl ?? input.canonicalUrl;
  const ogImageUrl = seo?.ogImageUrl ?? input.ogImageUrl;

  return {
    title,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl
        }
      : undefined,
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true
    },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: canonicalUrl,
      images: ogImageUrl ? [ogImageUrl] : undefined
    }
  };
}
