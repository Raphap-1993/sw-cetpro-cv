import Link from "next/link";
import { PublicSiteHeader } from "./PublicSiteHeader";
import { PublicSiteMotion } from "./PublicSiteMotion";
import { getSiteContent } from "../site-content";
import {
  institutionAddress,
  publicNotesHref,
  publicContactHref,
  publicNotesLabel,
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

export async function PublicSiteFrame(props: PublicSiteFrameProps) {
  const {
    children,
    contactHref = publicContactHref,
    navItems = publicPrimaryNav
  } = props;
  const siteContent = await getSiteContent();
  const siteName = siteContent["default-title"].title || "CETPRO Cesar Vallejo";

  return (
    <div id="public-site-root">
      <PublicSiteMotion />

      <a className="skipLink" href="#contenido">
        Saltar al contenido
      </a>

      <PublicSiteHeader
        ctaHref={publicNotesHref}
        ctaLabel={publicNotesLabel}
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
            <p className="eyebrow">Portal institucional</p>
            <h2>Programas, admisión y verificación institucional en una sola experiencia pública.</h2>
            <p>
              La navegación pública reúne formación presencial, consulta
              documental y orientación inicial con una lectura más clara y
              confiable.
            </p>
          </div>
          <Link className="publicFooterCta" href={contactHref}>
            Solicitar orientación
          </Link>
        </div>

        <div className="shell publicFooterGrid">
          <div className="publicFooterBrand">
            <div aria-hidden="true" className="publicFooterWordmark">
              <img
                alt=""
                className="publicFooterWordmarkImage"
                src="/brand/logo-cesar-vallejo-blanco.png"
              />
            </div>
            <p>
              Formación técnico-productiva presencial orientada al desarrollo de
              competencias, continuidad formativa y mejor lectura pública de la
              información institucional.
            </p>
          </div>

          <div className="publicFooterLinks">
            <strong>Explorar</strong>
            <Link href="/">Inicio</Link>
            <Link href="/institucion">Institución</Link>
            <Link href="/programas">Programas</Link>
            <Link href="/admision">Admisión</Link>
            <Link href="/gestion-institucional">Gestión institucional</Link>
            <Link href="/libro-de-reclamaciones">Libro de reclamaciones</Link>
          </div>

          <div className="publicFooterNote">
            <strong>Atención institucional</strong>
            <p>
              {institutionAddress}. Atención inicial orientada a programas,
              turnos, vacantes y requisitos desde la sede institucional.
            </p>
          </div>

          <div className="publicFooterNote">
            <strong>Consulta pública</strong>
            <p>
              Información académica, admisión, gestión institucional y canales
              formales disponibles para estudiantes, familias y comunidad
              educativa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
