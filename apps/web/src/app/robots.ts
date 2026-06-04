import type { MetadataRoute } from "next";

function getPrimaryWebOrigin() {
  return process.env.WEB_ORIGIN?.split(",")[0]?.trim() ?? "http://localhost:3010";
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${getPrimaryWebOrigin()}/sitemap.xml`
  };
}
