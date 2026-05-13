import "server-only";

import { listPageContent } from "@/lib/public-data";

type SiteContentKey = "default-title" | "default-description";

type SiteContentEntry = {
  body: string;
  title: string;
};

const fallbackSiteContent: Record<SiteContentKey, SiteContentEntry> = {
  "default-title": {
    title: "CETPRO Cesar Vallejo",
    body: ""
  },
  "default-description": {
    title: "",
    body: "Portal institucional del CETPRO Cesar Vallejo de Pucallpa"
  }
};

export async function getSiteContent() {
  const content = { ...fallbackSiteContent };
  const data = await listPageContent("site");

  for (const block of data) {
    if (!(block.key in content)) {
      continue;
    }

    const key = block.key as SiteContentKey;
    content[key] = {
      title: block.title?.trim() || content[key].title,
      body: block.body?.trim() || content[key].body
    };
  }

  return content;
}
