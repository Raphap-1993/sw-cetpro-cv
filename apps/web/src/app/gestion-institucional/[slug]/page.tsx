import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import styles from "@/app/public-site.module.css";
import {
  getManagementDocument,
  managementDocuments
} from "@/app/public-site";

type ManagementDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return managementDocuments.map((document) => ({
    slug: document.slug
  }));
}

export async function generateMetadata({
  params
}: ManagementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getManagementDocument(slug);

  if (!document) {
    return {
      title: "Documento institucional no encontrado",
      description:
        "La página solicitada no se encuentra disponible en la gestión institucional."
    };
  }

  return {
    title: `${document.title} | CETPRO Cesar Vallejo`,
    description: document.summary,
    alternates: {
      canonical: `/gestion-institucional/${slug}`
    }
  };
}

export default async function ManagementDetailPage({
  params
}: ManagementDetailPageProps) {
  const { slug } = await params;
  const document = getManagementDocument(slug);

  if (!document) {
    notFound();
  }

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.pageHero}>
        <div className={`shell ${styles.pageHeroGrid}`}>
          <div>
            <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/gestion-institucional">Gestión institucional</Link>
              <span>/</span>
              <span>{document.title}</span>
            </nav>
            <p className={styles.pageLabel}>Gestión / documento</p>
            <h1 className={styles.pageTitle}>{document.title}</h1>
            <p className={styles.pageLead}>{document.summary}</p>
          </div>

          <aside className={styles.sideNote}>
            <p className={styles.pageLabel}>Uso institucional</p>
            <h2>Cómo debe vivir esta página.</h2>
            <p>{document.useCase}</p>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={`shell ${styles.detailGrid}`}>
          <article className={styles.mainCard}>
            <p className={styles.pageLabel}>Qué debe contener</p>
            <ul className={styles.detailList}>
              {document.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.asideCard}>
            <p className={styles.pageLabel}>Señales normativas</p>
            <ul className={styles.legalSignalList}>
              {document.legalSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className="shell">
          <article className={styles.calloutCard}>
            <p className={styles.pageLabel}>Próximo nivel</p>
            <div className={styles.spacedBlock}>
              <h2>Conectar esta página a PDF aprobado o medio de verificación validado.</h2>
              <p>
                Esta implementación deja la estructura pública y el resumen editorial.
                El siguiente paso operativo es enlazar el documento definitivo desde
                media controlada o desde el repositorio institucional que corresponda.
              </p>
              <div className={styles.actionRow}>
                <Link className={styles.secondaryLink} href="/gestion-institucional">
                  Volver a gestión institucional
                </Link>
                <Link className={styles.primaryLink} href="/admision">
                  Ir a admisión
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
