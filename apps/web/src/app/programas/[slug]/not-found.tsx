import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import pageStyles from "@/app/public-site.module.css";
import { getProgramDetailContent } from "../content";
import styles from "../programs.module.css";

export default async function ProgramNotFound() {
  const content = await getProgramDetailContent();

  return (
    <PublicSiteFrame ctaHref="/admision" ctaLabel="Solicitar orientación">
      <section className={styles.detailSection}>
        <div className="shell">
          <article className={styles.emptyState}>
            <p className={pageStyles.eyebrow}>{content["not-found-eyebrow"].title}</p>
            <h1>{content["not-found"].title}</h1>
            <p>{content["not-found"].body}</p>
            <div className={pageStyles.actionRow}>
              <Link className={pageStyles.secondaryAction} href="/programas">
                {content["not-found-cta"].title}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
