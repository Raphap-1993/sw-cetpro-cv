import "server-only";

import type { Metadata } from "next";
import { getPublicPageSeo } from "./public-data";

type PageMetadataInput = {
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
  canonicalPath: string;
  fallbackOgImageUrl?: string;
};

export async function buildPageMetadata(
  input: PageMetadataInput
): Promise<Metadata> {
  const seo = await getPublicPageSeo(input.pageKey);
  const title = seo?.title ?? input.fallbackTitle;
  const description = seo?.description ?? input.fallbackDescription;
  const canonical = seo?.canonicalUrl ?? input.canonicalPath;
  const ogTitle = seo?.ogTitle ?? title;
  const ogDescription = seo?.ogDescription ?? description;
  const ogImage = seo?.ogImageUrl ?? input.fallbackOgImageUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}
