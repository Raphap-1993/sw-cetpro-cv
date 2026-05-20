import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Link from "next/link";
import UniversityPrototypeMotion from "./UniversityPrototypeMotion";
import styles from "./university-prototype.module.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--prototype-display"
});

const sans = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--prototype-sans"
});

export const metadata: Metadata = {
  title: "Prototipo universitario | CETPRO Cesar Vallejo",
  description:
    "Prototipo visual aislado para explorar una experiencia publica academica y moderna para el CETPRO Cesar Vallejo.",
  robots: {
    index: false,
    follow: false
  }
};

const navItems = [
  { href: "#programas", label: "Programas" },
  { href: "#experiencia", label: "Sistema" },
  { href: "#admision", label: "Admisión" },
  { href: "#institucion", label: "Institución" }
];

const heroTags = [
  "Academic-tech",
  "Catálogo con jerarquía",
  "Admisión más clara"
];

const signalCards = [
  {
    value: "07",
    label: "especialidades activas",
    copy:
      "La base actual ya permite un catálogo más expresivo sin inventar oferta nueva."
  },
  {
    value: "01",
    label: "portal institucional unificado",
    copy:
      "Programas, admisión, institución y gestión pública se leen como un mismo sistema."
  }
];

const programs = [
  {
    area: "Tecnología",
    code: "SIS",
    title: "Programación de sistemas de información",
    summary:
      "La especialidad se presenta como una ruta digital contemporánea: perfil, salida práctica y siguiente paso sin ruido.",
    chips: ["Ruta aplicada", "Perfil digital", "CTA directo"]
  },
  {
    area: "Industria alimentaria",
    code: "PAN",
    title: "Panificación industrial",
    summary:
      "El programa gana una presencia más sólida con una ficha limpia, comparativa y menos administrativa.",
    chips: ["Taller", "Proceso visible", "Oferta productiva"]
  },
  {
    area: "Diseño y confección",
    code: "PAT",
    title: "Patronaje",
    summary:
      "La narrativa deja de ser solo descriptiva y pasa a ordenar la decisión del postulante con mejor secuencia.",
    chips: ["Diseño aplicado", "Ruta práctica", "Lectura rápida"]
  },
  {
    area: "Electrónica",
    code: "ELE",
    title: "Mantenimiento electrónico",
    summary:
      "La tarjeta funciona como una señal académica fuerte, no como un bloque genérico repetido.",
    chips: ["Diagnóstico", "Campo técnico", "Narrativa moderna"]
  }
];

const systemPillars = [
  {
    eyebrow: "Jerarquía",
    title: "La home deja de apilar bloques iguales.",
    copy:
      "Cada sección cambia de ritmo y función: descubrir, comparar, confiar, postular."
  },
  {
    eyebrow: "Producto",
    title: "Se siente más plataforma académica que landing.",
    copy:
      "Paneles, cápsulas, badges y rails construyen una experiencia más actual sin perder seriedad."
  },
  {
    eyebrow: "Escalabilidad",
    title: "Los patrones sí pueden subir a la web real.",
    copy:
      "El lenguaje visual nuevo no rompe el stack ni el CMS; solo mejora su lectura pública."
  }
];

const admissionSteps = [
  {
    title: "Explora la especialidad",
    copy:
      "El catálogo resume mejor la oferta y ayuda a comparar sin obligar al usuario a leer párrafos largos."
  },
  {
    title: "Aterriza requisitos y orientación",
    copy:
      "Admisión concentra el proceso, los documentos y el formulario en una misma capa de decisión."
  },
  {
    title: "Deja la solicitud",
    copy:
      "El CTA final conversa con el flujo real de leads, sin depender de hacks visuales ni anclas improvisadas."
  }
];

const institutionalLinks = [
  {
    href: "/institucion",
    label: "Conocer la institución",
    meta: "Contexto",
    copy:
      "Misión, propuesta y tono institucional organizados con más presencia y mejor contraste."
  },
  {
    href: "/gestion-institucional",
    label: "Gestión institucional",
    meta: "Verificación",
    copy:
      "Los documentos y páginas formales pasan a sentirse parte del producto, no anexos perdidos."
  },
  {
    href: "/libro-de-reclamaciones",
    label: "Libro de reclamaciones",
    meta: "Canal formal",
    copy:
      "La ruta legal visible convive con la captación y refuerza confianza en lugar de esconderse."
  }
];

export default function UniversityPrototypePage() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${styles.prototypeRoot}`}
      id="university-prototype"
    >
      <UniversityPrototypeMotion />
      <header className={styles.headerWrap}>
        <div className={`${styles.shell} ${styles.header}`}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandSeal} aria-hidden="true">
              CV
            </span>
            <span>
              <strong>CETPRO César Vallejo</strong>
              <small>Pucallpa · Formación técnico-productiva</small>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Navegación del prototipo">
            {navItems.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <Link className={styles.headerAction} href="/admision">
            Abrir admisión
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={`${styles.shell} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Prototype direction · Academic-tech</p>
              <h1>Un CETPRO que se vea actual, serio y listo para convertir interés.</h1>
              <p className={styles.heroLead}>
                Esta variante abandona la dirección editorial repetida y empuja
                una identidad más contemporánea: contraste limpio, componentes
                más modulares y una experiencia pública que se siente más
                producto académico que brochure tradicional.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} href="/programas">
                  Ver programas
                </Link>
                <Link className={styles.secondaryAction} href="/admision">
                  Revisar admisión
                </Link>
              </div>
              <div className={styles.heroTags} aria-label="Señales de dirección visual">
                {heroTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.heroStage}>
              <div className={styles.heroImageCard}>
                <span className={styles.heroImageBadge}>Campus presencial · Pucallpa</span>
                <img src="/brand/hero-students.svg" alt="" />
                <div className={styles.heroImageCaption}>
                  <strong>Estudiantes, formación y comunidad visible</strong>
                  <p>
                    El bloque lateral ahora acompaña mejor la propuesta
                    académica con una escena estudiantil más creíble y cercana.
                  </p>
                </div>
              </div>

              <div className={styles.signalGrid}>
                {signalCards.map((item) => (
                  <article className={styles.signalCard} key={item.label}>
                    <span>{item.value}</span>
                    <strong>{item.label}</strong>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.programSection} id="programas">
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Oferta académica</p>
              <h2>Programas pensados como un mosaico académico, no como cards clonadas.</h2>
              <p>
                Cada especialidad se apoya más en jerarquía, código visual y
                ritmo de lectura. El objetivo es que el catálogo se sienta más
                distintivo, más moderno y más fácil de recorrer.
              </p>
            </div>

            <div className={styles.programGrid}>
              {programs.map((program) => (
                <article className={styles.programCard} key={program.title}>
                  <div className={styles.programTop}>
                    <span>{program.area}</span>
                    <strong className={styles.programCode}>{program.code}</strong>
                  </div>
                  <div className={styles.programBody}>
                    <h3>{program.title}</h3>
                    <p>{program.summary}</p>
                    <div className={styles.programChips}>
                      {program.chips.map((chip) => (
                        <span key={chip}>{chip}</span>
                      ))}
                    </div>
                    <Link href="/programas">Ver ficha académica</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.systemSection} id="experiencia">
          <div className={`${styles.shell} ${styles.systemGrid}`}>
            <div className={styles.systemLead}>
              <p className={styles.eyebrow}>Sistema público</p>
              <h2>No es un landing más. Se siente como una plataforma académica compacta.</h2>
              <p>
                El cambio fuerte está en la secuencia. Esta propuesta pone más
                intención en cómo descubrir, comparar, confiar y postular sin
                caer en el patrón de hero grande + grid estándar + serif de
                siempre.
              </p>
            </div>

            <div className={styles.systemCards}>
              {systemPillars.map((item) => (
                <article className={styles.systemCard} key={item.title}>
                  <span>{item.eyebrow}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.admissionSection} id="admision">
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Admisión</p>
              <h2>Una ruta de admisión que acompaña mejor la decisión.</h2>
              <p>
                La página de admisión gana peso propio: más estructura, más
                claridad de proceso y una conversión mejor integrada con el
                flujo real de leads.
              </p>
            </div>

            <div className={styles.admissionGrid}>
              <ol className={styles.stepList}>
                {admissionSteps.map((step, index) => (
                  <li key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <aside className={styles.admissionPanel}>
                <p className={styles.panelLabel}>Qué cambia en esta versión</p>
                <h3>El CTA ya no parece accesorio.</h3>
                <p>
                  Se vuelve parte del recorrido principal, con mejor contraste y
                  una lectura más coherente entre información, confianza y
                  acción.
                </p>
                <ul className={styles.panelList}>
                  <li>Mejor separación entre explorar y postular.</li>
                  <li>Menos ruido visual antes de pedir datos.</li>
                  <li>Más espacio para requisitos y validaciones futuras.</li>
                </ul>
                <Link className={styles.panelAction} href="/admision">
                  Ir a admisión
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.institutionSection} id="institucion">
          <div className={`${styles.shell} ${styles.institutionGrid}`}>
            <div className={styles.institutionCopy}>
              <p className={styles.eyebrow}>Institución</p>
              <h2>Autoridad académica, documentación y canales visibles en una sola capa.</h2>
              <p>
                Esta propuesta mantiene el alcance real del CETPRO y evita
                afirmar datos no validados. La mejora está en arquitectura,
                jerarquía, contraste y lenguaje visual.
              </p>
              <div className={styles.documentStrip}>
                <span>Institución</span>
                <span>Gestión</span>
                <span>Admisión</span>
                <span>Canales formales</span>
              </div>
            </div>

            <div className={styles.linkStack}>
              {institutionalLinks.map((item) => (
                <Link className={styles.linkCard} href={item.href} key={item.href}>
                  <div className={styles.linkMeta}>
                    <span>{item.meta}</span>
                    <span>→</span>
                  </div>
                  <strong>{item.label}</strong>
                  <p>{item.copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
