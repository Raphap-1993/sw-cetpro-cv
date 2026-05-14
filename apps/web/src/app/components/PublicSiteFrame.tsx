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
  ctaLabel = "Solicitar información",
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
            <h2>Conoce la oferta académica y continúa tu proceso de admisión con información clara.</h2>
            <p>
              La institución pone a disposición programas, requisitos de
              admisión y canales de atención para orientar cada consulta.
            </p>
          </div>
          <Link className="publicFooterCta" href={contactHref}>
            Proceso de admisión
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
                  <span>Información institucional</span>
                </span>
                <strong>{siteName}</strong>
                <small>{description}</small>
              </span>
            </div>
            <p>
              Formación técnico-productiva presencial orientada al desarrollo de
              competencias, la práctica y la atención responsable del estudiante.
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
              admisión se atiende mediante los canales institucionales para
              resolver consultas sobre programas, modalidad, turnos y vacantes.
            </p>
          </div>

          <div className="publicFooterNote">
            <strong>Información pública</strong>
            <p>
              Programas, admisión, gestión institucional y libro de
              reclamaciones disponibles para consulta de estudiantes, familias y
              comunidad educativa.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
