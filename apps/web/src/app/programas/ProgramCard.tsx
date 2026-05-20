import Link from "next/link";
import styles from "./programs.module.css";
import {
  getProgramCode,
  getProgramCopy,
  getProgramIllustrationUrl,
  getProgramPath,
  type PublicProgram
} from "./programs";

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
  eyebrow: "Especialidad técnica",
  durationLabel: "Duración",
  modalityLabel: "Modalidad",
  ctaLabel: "Ver programa"
};

export function ProgramCard({
  copy = defaultProgramCardCopy,
  program
}: ProgramCardProps) {
  const programSummary = getProgramCopy(program);
  const studyPlanState = program.studyPlan ? "Plan de estudio referencial" : "Información general";
  const programCode = getProgramCode(program.title);
  const illustrationUrl = getProgramIllustrationUrl(
    program.slug,
    program.title,
    program.imageUrl
  );
  const chips = [
    program.duration ?? "Duración por confirmar",
    program.modality ?? "Modalidad por confirmar",
    studyPlanState
  ];

  return (
    <article className={styles.programCard}>
      <div aria-hidden="true" className={styles.programCardMedia}>
        <img alt="" src={illustrationUrl} />
      </div>

      <div className={styles.programCardTop}>
        <span>{copy.eyebrow}</span>
        <strong className={styles.programCode}>{programCode}</strong>
      </div>

      <div className={styles.programCardBody}>
        <p className={styles.programCardMeta}>
          {program.modality ?? "Modalidad presencial por confirmar"}
        </p>
        <h3 className={styles.programCardTitle}>
          <Link href={getProgramPath(program.slug)}>{program.title}</Link>
        </h3>
        <p className={styles.programCardSummary}>{programSummary}</p>

        <div className={styles.programChips}>
          {chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>

        <div className={styles.programCardFooter}>
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
          <Link className={styles.programCardLink} href={getProgramPath(program.slug)}>
            {copy.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
