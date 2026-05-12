import Link from "next/link";
import styles from "./programs.module.css";
import { getProgramCopy, getProgramPath, type PublicProgram } from "./programs";

export type ProgramCardCopy = {
  ctaLabel: string;
  durationLabel: string;
  eyebrow: string;
  modalityLabel: string;
};

type ProgramCardProps = {
  copy?: ProgramCardCopy;
  program: PublicProgram;
};

const defaultProgramCardCopy: ProgramCardCopy = {
  eyebrow: "Especialidad tecnica",
  durationLabel: "Duración",
  modalityLabel: "Modalidad",
  ctaLabel: "Ver detalle"
};

export function ProgramCard({
  copy = defaultProgramCardCopy,
  program
}: ProgramCardProps) {
  const mediaStyle = program.imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(16, 32, 51, 0.08), rgba(16, 32, 51, 0.42)), url("${program.imageUrl}")`
      }
    : undefined;

  return (
    <article className={styles.programCard}>
      <div
        aria-hidden="true"
        className={styles.programCardMedia}
        style={mediaStyle}
      />

      <div className={styles.programCardBody}>
        <div className={styles.programCardHeader}>
          <p className={styles.programCardEyebrow}>{copy.eyebrow}</p>
          <h3 className={styles.programCardTitle}>
            <Link href={getProgramPath(program.slug)}>{program.title}</Link>
          </h3>
        </div>

        <p className={styles.programCardSummary}>{getProgramCopy(program)}</p>

        <dl className={styles.programMetaList}>
          <div className={styles.programMetaItem}>
            <dt>{copy.durationLabel}</dt>
            <dd>{program.duration ?? "Por confirmar"}</dd>
          </div>
          <div className={styles.programMetaItem}>
            <dt>{copy.modalityLabel}</dt>
            <dd>{program.modality ?? "Por confirmar"}</dd>
          </div>
        </dl>

        <div className={styles.programCardFooter}>
          <Link className={styles.programCardLink} href={getProgramPath(program.slug)}>
            {copy.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
