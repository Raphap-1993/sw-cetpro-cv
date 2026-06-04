import "server-only";

export type PublicProgramSummary = {
  description?: string | null;
  id: string;
  imageUrl: string | null;
  studyPlan?: string | null;
  title: string;
  slug: string;
  summary: string | null;
  duration: string | null;
  modality: string | null;
};

export type PublicProgramDetail = PublicProgramSummary & {
  description: string | null;
  studyPlan: string | null;
};

export type PublicContentBlock = {
  body: string | null;
  key: string;
  mediaUrl: string | null;
  title: string | null;
};

export type PublicPageSeo = {
  pageKey: string;
  title: string;
  description: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

function getApiUrl() {
  return (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4010/api"
  );
}

async function requestPublicJson<T>(path: string) {
  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function listPublishedPrograms() {
  const data = await requestPublicJson<PublicProgramSummary[]>("/programs");
  return Array.isArray(data) ? data : [];
}

export async function getPublishedProgram(slug: string) {
  const data = await requestPublicJson<PublicProgramDetail>(
    `/programs/${encodeURIComponent(slug)}`
  );

  if (!data || typeof data !== "object" || !("id" in data)) {
    return null;
  }

  return data;
}

export async function listPageContent(page: string) {
  const data = await requestPublicJson<PublicContentBlock[]>(
    `/content/${encodeURIComponent(page)}`
  );

  return Array.isArray(data) ? data : [];
}

export async function getPublicPageSeo(pageKey: string) {
  const data = await requestPublicJson<PublicPageSeo>(
    `/seo/public/${encodeURIComponent(pageKey)}`
  );

  if (!data || typeof data !== "object" || data.pageKey !== pageKey) {
    return null;
  }

  return data;
}
