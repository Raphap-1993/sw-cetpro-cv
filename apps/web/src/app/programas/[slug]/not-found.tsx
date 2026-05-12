import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getProgramDetailContent } from "../content";

export default async function ProgramNotFound() {
  const content = await getProgramDetailContent();

  return (
    <PublicSiteFrame
      contactHref="/#contacto"
      ctaHref="/#contacto"
      navItems={[
        { href: "/", label: "Inicio" },
        { href: "/programas", label: "Catalogo" },
        { href: "/#contacto", label: "Contacto" }
      ]}
    >
      <section className="section">
        <div className="shell">
          <article className="emptyStatePanel">
            <p className="eyebrow">{content["not-found-eyebrow"].title}</p>
            <h1>{content["not-found"].title}</h1>
            <p>{content["not-found"].body}</p>
            <div className="sectionActions">
              <Link className="inlineAction" href="/programas">
                {content["not-found-cta"].title}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
