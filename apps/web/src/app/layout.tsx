import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
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

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();

  return {
    metadataBase: getMetadataBase(),
    title: siteContent["default-title"].title,
    description: siteContent["default-description"].body
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={publicSans.variable}>
        {children}
      </body>
    </html>
  );
}
