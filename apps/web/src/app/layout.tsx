import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { institutionAddress } from "./public-site";
import { getSiteContent } from "./site-content";

const publicSans = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

function getMetadataBase() {
  const origin = process.env.WEB_ORIGIN?.split(",")[0]?.trim();

  if (!origin) {
    return undefined;
  }

  try {
    return new URL(origin);
  } catch {
    return undefined;
  }
}

function buildEducationalOrganizationJsonLd(siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteName,
    url: getMetadataBase()?.toString() ?? "/",
    address: {
      "@type": "PostalAddress",
      streetAddress: institutionAddress,
      addressLocality: "Pucallpa",
      addressRegion: "Ucayali",
      addressCountry: "PE"
    },
    areaServed: ["Pucallpa", "Ucayali", "Peru"]
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();

  return {
    metadataBase: getMetadataBase(),
    title: siteContent["default-title"].title,
    description: siteContent["default-description"].body
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();
  const siteName = siteContent["default-title"].title || "CETPRO Cesar Vallejo";

  return (
    <html lang="es">
      <body className={publicSans.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildEducationalOrganizationJsonLd(siteName))
          }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  );
}
