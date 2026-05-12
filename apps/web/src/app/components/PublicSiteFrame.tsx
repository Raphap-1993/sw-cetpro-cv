import Link from "next/link";
import { PublicSiteHeader } from "./PublicSiteHeader";
import { getSiteContent } from "../site-content";

type PublicNavItem = {
  href: string;
  label: string;
};

type PublicSiteFrameProps = {
  children: React.ReactNode;
  contactHref: string;
  ctaHref?: string;
  ctaLabel?: string;
  navItems: PublicNavItem[];
};

const institutionAddress = "Jr. Comandante Barrera 458, Pucallpa";

export async function PublicSiteFrame({
  children,
  contactHref,
  ctaHref,
  ctaLabel = "Solicitar orientacion",
  navItems
}: PublicSiteFrameProps) {
  const siteContent = await getSiteContent();
  const siteName = siteContent["default-title"].title || "CETPRO Cesar Vallejo";
  const description =
    siteContent["default-description"].body ||
    "Formacion tecnico-productiva presencial en Pucallpa";

  return (
    <>
      <a className="skipLink" href="#contenido">
        Saltar al contenido
      </a>

      <PublicSiteHeader
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        navItems={navItems}
        siteName={siteName}
        tagline="Formacion tecnico-productiva presencial"
      />

      <main className="publicMain" id="contenido">
        {children}
      </main>

      <footer className="publicFooter">
        <div className="shell publicFooterGrid">
          <div className="publicFooterBrand">
            <div className="publicBrand publicBrandFooter">
              <span aria-hidden="true" className="publicBrandMark">
                CETPRO
              </span>
              <span className="publicBrandCopy">
                <strong>{siteName}</strong>
                <small>{description}</small>
              </span>
            </div>
            <p>{institutionAddress}</p>
          </div>

          <div className="publicFooterLinks">
            <strong>Explorar</strong>
            <Link href="/">Inicio</Link>
            <Link href="/programas">Programas</Link>
            <Link href={contactHref}>Contacto y admision</Link>
          </div>

          <div className="publicFooterNote">
            <strong>Atencion institucional</strong>
            <p>
              Formacion tecnico-productiva orientada al trabajo, la continuidad
              formativa y el emprendimiento, con orientacion de matricula desde
              la web institucional.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
