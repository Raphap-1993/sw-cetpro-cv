import Link from "next/link";
import { PublicSiteFrame } from "@/app/components/PublicSiteFrame";
import { getProgramDetailContent } from "../content";
import styles from "../programs.module.css";

export default async function ProgramNotFound() {
  const content = await getProgramDetailContent();

  return (
    <PublicSiteFrame ctaHref="/admision">
      <section className={styles.detailSection}>
        <div className="shell">
          <article className={styles.emptyState}>
            <p className={styles.pageLabel}>{content["not-found-eyebrow"].title}</p>
            <h1>{content["not-found"].title}</h1>
            <p>{content["not-found"].body}</p>
            <div className={styles.actionRow}>
              <Link className={styles.secondaryAction} href="/programas">
                {content["not-found-cta"].title}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PublicSiteFrame>
  );
}
