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
  ctaLabel = "Solicitar orientación",
  navItems
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
            <h2>Explora la oferta pública y solicita acompañamiento institucional.</h2>
            <p>
              Una experiencia más clara desde la consulta inicial hasta el
              contacto con el equipo administrativo.
            </p>
          </div>
          <Link className="publicFooterCta" href={contactHref}>
            Iniciar consulta
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
              Formación técnico-productiva presencial orientada al desempeño,
              la continuidad formativa y la proyección al trabajo.
            </p>
          </div>

          <div className="publicFooterLinks">
            <strong>Explorar</strong>
            <Link href="/">Inicio</Link>
            <Link href="/programas">Programas</Link>
            <Link href={contactHref}>Contacto y admisión</Link>
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
            <strong>Ruta pública</strong>
            <p>
              Catálogo, detalle de programas, evidencia institucional y
              formulario de contacto en una sola experiencia coherente.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
