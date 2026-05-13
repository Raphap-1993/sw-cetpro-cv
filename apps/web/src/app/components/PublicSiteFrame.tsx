import Link from "next/link";
import { PublicSiteHeader } from "./PublicSiteHeader";
import { getSiteContent } from "../site-content";
import {
  institutionAddress,
  publicPrimaryNav,
  type PublicNavItem
} from "../public-site";

type PublicSiteFrameProps = {
  children: React.ReactNode;
  contactHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
  navItems?: PublicNavItem[];
};

export async function PublicSiteFrame({
  children,
  contactHref = "/admision",
  ctaHref,
  ctaLabel = "Solicitar orientación",
  navItems = publicPrimaryNav
}: PublicSiteFrameProps) {
  const siteContent = await getSiteContent();
  const siteName = siteContent["default-title"].title || "CETPRO Cesar Vallejo";
  const description =
    siteContent["default-description"].body ||
    "Formación técnico-productiva presencial en Pucallpa";

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
        tagline="Centro de educación técnico-productiva presencial"
      />

      <main className="publicMain" id="contenido">
        {children}
      </main>

      <footer className="publicFooter">
        <div className="shell publicFooterCallout">
          <div className="publicFooterCalloutCopy">
            <p className="eyebrow">Admisión y orientación</p>
            <h2>Explora la oferta, revisa la institución y continúa la admisión con más contexto.</h2>
            <p>
              La web pública ya no funciona como landing única: organiza
              programas, gestión y atención administrativa por páginas reales.
            </p>
          </div>
          <Link className="publicFooterCta" href={contactHref}>
            Ir a admisión
          </Link>
        </div>

        <div className="shell publicFooterGrid">
          <div className="publicFooterBrand">
            <div className="publicBrand publicBrandFooter">
              <span aria-hidden="true" className="publicBrandMark">
                <span className="publicBrandMarkSeal">CV</span>
                <span className="publicBrandMarkWord">CETPRO</span>
              </span>
              <span className="publicBrandCopy">
                <span className="publicBrandMeta">
                  <span>Pucallpa</span>
                  <span>Oferta pública</span>
                </span>
                <strong>{siteName}</strong>
                <small>{description}</small>
              </span>
            </div>
            <p>
              Formación técnico-productiva presencial orientada a práctica,
              continuidad formativa y una lectura institucional más clara.
            </p>
          </div>

          <div className="publicFooterLinks">
            <strong>Explorar</strong>
            <Link href="/">Inicio</Link>
            <Link href="/institucion">Institución</Link>
            <Link href="/programas">Programas</Link>
            <Link href="/gestion-institucional">Gestión institucional</Link>
            <Link href="/libro-de-reclamaciones">Libro de reclamaciones</Link>
            <Link href={contactHref}>Admisión</Link>
          </div>

          <div className="publicFooterNote">
            <strong>Atención institucional</strong>
            <p>
              Sede institucional: {institutionAddress}. La orientación de
              matrícula se atiende desde la web institucional para ayudarte a
              evaluar programa, modalidad, turnos y vacantes.
            </p>
          </div>

          <div className="publicFooterNote">
            <strong>Portal institucional</strong>
            <p>
              Programas, admisión, gestión institucional y libro de
              reclamaciones en una arquitectura pública más verificable.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
