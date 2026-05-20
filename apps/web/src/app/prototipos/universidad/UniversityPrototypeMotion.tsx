"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./university-prototype.module.css";

const ROOT_SELECTOR = "#university-prototype";

function compact<T>(values: Array<T | null | undefined>): T[] {
  return values.filter((value): value is T => value != null);
}

export default function UniversityPrototypeMotion() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const root = document.querySelector(ROOT_SELECTOR);

    if (!(root instanceof HTMLElement)) {
      return;
    }

    const ctx = gsap.context(() => {
      const heroSection = root.querySelector<HTMLElement>(`.${styles.hero}`);
      const heroCopy = root.querySelector<HTMLElement>(`.${styles.heroCopy}`);
      const heroBadge = root.querySelector<HTMLElement>(`.${styles.heroImageBadge}`);
      const heroCard = root.querySelector<HTMLElement>(`.${styles.heroImageCard}`);
      const heroCaption = root.querySelector<HTMLElement>(`.${styles.heroImageCaption}`);
      const heroStage = root.querySelector<HTMLElement>(`.${styles.heroStage}`);
      const heroTitle = heroCopy?.querySelector<HTMLElement>("h1");
      const heroEyebrow = heroCopy?.querySelector<HTMLElement>(`.${styles.eyebrow}`);
      const heroLead = heroCopy?.querySelector<HTMLElement>(`.${styles.heroLead}`);
      const heroActions = heroCopy?.querySelector<HTMLElement>(`.${styles.heroActions}`);
      const heroTags = heroCopy?.querySelectorAll<HTMLElement>(`.${styles.heroTags} span`) ?? [];
      const signalCards = root.querySelectorAll<HTMLElement>(`.${styles.signalCard}`);

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      heroTimeline
        .from(`.${styles.header}`, {
          y: -20,
          opacity: 0,
          duration: 0.8
        })
        .from(
          compact([heroEyebrow, heroTitle, heroLead, heroActions]),
          {
            y: 28,
            opacity: 0,
            duration: 0.78,
            stagger: 0.1
          },
          "-=0.45"
        )
        .from(
          heroTags,
          {
            y: 14,
            opacity: 0,
            duration: 0.42,
            stagger: 0.06
          },
          "-=0.28"
        )
        .from(
          heroCard,
          {
            y: 54,
            opacity: 0,
            scale: 0.96,
            rotateX: 8,
            transformOrigin: "50% 100%",
            duration: 1.05
          },
          "-=0.78"
        )
        .from(
          compact([heroBadge, heroCaption]),
          {
            y: 18,
            opacity: 0,
            duration: 0.48,
            stagger: 0.08
          },
          "-=0.4"
        )
        .from(
          signalCards,
          {
            y: 24,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08
          },
          "-=0.44"
        );

      if (window.innerWidth >= 960) {
        root.dataset.motionMode = "desktop";

        gsap.to(heroCopy, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection ?? undefined,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            onUpdate(self) {
              root.dataset.heroParallax = self.progress.toFixed(2);
            }
          }
        });

        gsap.to(heroStage, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection ?? undefined,
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });
      } else {
        root.dataset.motionMode = "mobile";
      }

      const sectionHeaders = root.querySelectorAll<HTMLElement>(`.${styles.sectionHeader}`);

      sectionHeaders.forEach((header) => {
        gsap.from(header.children, {
          y: 28,
          opacity: 0,
          duration: 0.68,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 82%",
            once: true
          }
        });
      });

      const programCards = gsap.utils.toArray<HTMLElement>(`.${styles.programCard}`);

      programCards.forEach((card, index) => {
        const cardTop = card.querySelector<HTMLElement>(`.${styles.programTop}`);
        const title = card.querySelector<HTMLElement>("h3");
        const summary = card.querySelector<HTMLElement>("p");
        const chips = card.querySelectorAll<HTMLElement>(`.${styles.programChips} span`);
        const link = card.querySelector<HTMLElement>("a");
        const code = card.querySelector<HTMLElement>(`.${styles.programCode}`);

        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            once: true
          }
        });

        cardTimeline
          .from(card, {
            y: 38 + index * 4,
            opacity: 0,
            duration: 0.72,
            ease: "power2.out",
            clearProps: "transform"
          })
          .from(
            compact([cardTop, title, summary, ...chips, link]),
            {
              y: 18,
              opacity: 0,
              duration: 0.46,
              stagger: 0.05
            },
            "-=0.52"
          );

        if (window.innerWidth >= 960 && code) {
          gsap.to(code, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9
            }
          });
        }
      });

      const systemLead = root.querySelector<HTMLElement>(`.${styles.systemLead}`);
      const systemCardsWrap = root.querySelector<HTMLElement>(`.${styles.systemCards}`);
      const systemCards = root.querySelectorAll<HTMLElement>(`.${styles.systemCard}`);

      gsap.from(systemLead, {
        x: -48,
        opacity: 0,
        duration: 0.88,
        ease: "power3.out",
        scrollTrigger: {
          trigger: systemLead,
          start: "top 80%",
          once: true
        }
      });

      gsap.from(systemCards, {
        x: 44,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: systemCardsWrap ?? undefined,
          start: "top 80%",
          once: true
        }
      });

      const admissionGrid = root.querySelector<HTMLElement>(`.${styles.admissionGrid}`);
      const stepCards = root.querySelectorAll<HTMLElement>(`.${styles.stepList} li`);
      const admissionPanel = root.querySelector<HTMLElement>(`.${styles.admissionPanel}`);

      gsap.from(stepCards, {
        y: 34,
        opacity: 0,
        duration: 0.72,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: admissionGrid ?? undefined,
          start: "top 82%",
          once: true
        }
      });

      gsap.from(admissionPanel, {
        y: 36,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: admissionPanel,
          start: "top 84%",
          once: true
        }
      });

      const institutionCopy = root.querySelector<HTMLElement>(`.${styles.institutionCopy}`);
      const documentChips = root.querySelectorAll<HTMLElement>(`.${styles.documentStrip} span`);
      const linkStack = root.querySelector<HTMLElement>(`.${styles.linkStack}`);
      const linkCards = root.querySelectorAll<HTMLElement>(`.${styles.linkCard}`);

      gsap.from(
        compact([
          institutionCopy?.querySelector<HTMLElement>(`.${styles.eyebrow}`),
          institutionCopy?.querySelector<HTMLElement>("h2"),
          institutionCopy?.querySelector<HTMLElement>("p"),
          ...documentChips
        ]),
        {
          y: 22,
          opacity: 0,
          duration: 0.62,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: institutionCopy,
            start: "top 82%",
            once: true
          }
        }
      );

      gsap.from(linkCards, {
        x: 34,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: linkStack ?? undefined,
          start: "top 82%",
          once: true
        }
      });

      root.dataset.motionReady = "true";
      root.dataset.motionTriggers = String(ScrollTrigger.getAll().length);
      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
